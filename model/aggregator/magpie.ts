import { getAddress, isAddressEqual, zeroAddress } from 'viem'
import { CHAIN_IDS } from '@clober/v2-sdk'

import { Chain } from '../chain'
import { Currency } from '../currency'
import { fetchApi } from '../../apis/utils'
import { Prices } from '../prices'
import { PathViz } from '../pathviz'

import { Aggregator } from './index'

export class MagpieAggregator implements Aggregator {
  public readonly name = 'Magpie'
  public readonly baseUrl = 'https://api.magpiefi.xyz'
  public readonly contract: `0x${string}`
  public readonly chain: Chain
  private readonly TIMEOUT = 2000
  private readonly nativeTokenAddress = zeroAddress

  private chainName: string
  private latestQuoteId: string | undefined
  private transactionCache: {
    [quoteId: string]: {
      data: `0x${string}`
      gas: bigint
      value: bigint
      to: `0x${string}`
      nonce?: number
      gasPrice?: bigint
    }
  } = {}

  constructor(contract: `0x${string}`, chain: Chain) {
    this.contract = contract
    this.chain = chain
    this.chainName = this.getChainName(chain.id)
  }

  public async currencies(): Promise<Currency[]> {
    return (
      await fetchApi<
        {
          address: string
          name: string
          symbol: string
          decimals: number
        }[]
      >(this.baseUrl, 'token-manager/tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        timeout: this.TIMEOUT,
        data: {
          networkNames: [this.chainName],
          searchValue: '',
          exact: false,
          offset: 0,
        },
      })
    ).map((token) => ({
      address: getAddress(token.address),
      name: token.name,
      symbol: token.symbol,
      decimals: token.decimals,
    }))
  }

  public async prices(): Promise<Prices> {
    return (
      await fetchApi<
        {
          address: string
          usdPrice: string
        }[]
      >(this.baseUrl, 'token-manager/tokens', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
        timeout: this.TIMEOUT,
        data: {
          networkNames: [this.chainName],
          searchValue: '',
          exact: false,
          offset: 0,
        },
      })
    ).reduce((acc, token) => {
      acc[getAddress(token.address)] = Number(token.usdPrice)
      return acc
    }, {} as Prices)
  }

  public async quote(
    inputCurrency: Currency,
    amountIn: bigint,
    outputCurrency: Currency,
    slippageLimitPercent: number,
    gasPrice: bigint,
    userAddress?: `0x${string}`,
  ): Promise<{
    amountOut: bigint
    gasLimit: bigint
    pathViz: PathViz | undefined
    aggregator: Aggregator
  }> {
    this.latestQuoteId = undefined
    const response = await fetchApi<{
      id: string
      amountOut: string
      fees: {
        type: string
        value: string
      }[]
      resourceEstimate: { gasLimit: string }
    }>(this.baseUrl, 'aggregator/quote', {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
      timeout: this.TIMEOUT,
      params: {
        network: this.chainName,
        fromTokenAddress: isAddressEqual(
          inputCurrency.address,
          this.nativeTokenAddress,
        )
          ? this.nativeTokenAddress
          : getAddress(inputCurrency.address),
        toTokenAddress: isAddressEqual(
          outputCurrency.address,
          this.nativeTokenAddress,
        )
          ? this.nativeTokenAddress
          : getAddress(outputCurrency.address),
        sellAmount: amountIn.toString(),
        slippage: slippageLimitPercent / 100,
        fromAddress: userAddress,
        toAddress: userAddress,
        gasless: false,
        // affiliateAddress: '0x0000000000000000000000000000000000000000',
        // affiliateFeeInPercentage: 0.01, // 1%
      },
    })
    this.latestQuoteId = response.id

    const estimatedGas = response.fees.find((fee) => fee.type === 'gas')?.value
    if (!estimatedGas) {
      throw new Error('Estimated gas not found')
    }

    if (userAddress) {
      this.transactionCache[this.latestQuoteId] = await this.buildCallData(
        inputCurrency,
        amountIn,
        outputCurrency,
        slippageLimitPercent,
        gasPrice,
        userAddress,
      )
    }

    return {
      amountOut: BigInt(response.amountOut),
      gasLimit: BigInt(response.resourceEstimate.gasLimit),
      pathViz: undefined,
      aggregator: this,
    }
  }

  public async buildCallData(
    inputCurrency: Currency,
    amountIn: bigint,
    outputCurrency: Currency,
    slippageLimitPercent: number,
    gasPrice: bigint,
    userAddress: `0x${string}`,
  ): Promise<{
    data: `0x${string}`
    gas: bigint
    value: bigint
    to: `0x${string}`
    nonce?: number
    gasPrice?: bigint
  }> {
    if (!this.latestQuoteId) {
      await this.quote(
        inputCurrency,
        amountIn,
        outputCurrency,
        slippageLimitPercent,
        gasPrice,
        userAddress,
      )
    }

    if (!this.latestQuoteId) {
      throw new Error('Quote ID is not defined')
    }

    if (this.transactionCache[this.latestQuoteId]) {
      return this.transactionCache[this.latestQuoteId]
    }

    const response = await fetchApi<{
      data: string
      gasLimit: string
      value: string
      to: string
    }>(this.baseUrl, 'aggregator/transaction', {
      method: 'GET',
      params: {
        quoteId: this.latestQuoteId,
        estimateGas: true,
      },
      headers: {
        accept: 'application/json',
      },
      timeout: this.TIMEOUT,
    })

    return {
      data: response.data as `0x${string}`,
      gas: BigInt(response.gasLimit),
      value: BigInt(response.value),
      to: response.to as `0x${string}`,
      gasPrice: gasPrice,
    }
  }

  private getChainName(chainId: CHAIN_IDS): string {
    const chainMap: { [key: number]: string } = {
      1: 'ethereum',
      56: 'bsc',
      42161: 'arbitrum',
      137: 'polygon',
      10: 'optimism',
      43114: 'avalanche',
      8453: 'base',
      324: 'zksync',
      250: 'fantom',
      59144: 'linea',
      1101: 'polygon-zkevm',
      534352: 'scroll',
      5000: 'mantle',
      81457: 'blast',
      146: 'sonic',
    }
    const name = chainMap[chainId]
    if (!name) {
      throw new Error(`Unsupported chain ID: ${chainId}`)
    }
    return name
  }
}
