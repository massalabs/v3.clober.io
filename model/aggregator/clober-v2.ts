import {
  encodeFunctionData,
  getAddress,
  isAddressEqual,
  parseUnits,
  zeroAddress,
} from 'viem'
import {
  getExpectedOutput,
  getSubgraphEndpoint,
  marketOrder,
} from '@clober/v2-sdk'
import { monadTestnet } from 'viem/chains'

import { Currency } from '../currency'
import { Prices } from '../prices'
import { PathViz } from '../pathviz'
import { RPC_URL } from '../../constants/rpc-url'
import { formatUnits } from '../../utils/bigint'
import { WETH } from '../../constants/currency'
import { WETH_ABI } from '../../abis/weth-abi'
import { Chain } from '../chain'
import { Subgraph } from '../subgraph'

import { Aggregator } from './index'

export class CloberV2Aggregator implements Aggregator {
  public readonly name = 'CloberV2'
  public readonly baseUrl = ''
  public readonly contract: `0x${string}`
  private readonly nativeTokenAddress = zeroAddress
  public readonly chain: Chain
  public readonly weth: `0x${string}`

  private defaultGasLimit = 500_000n

  constructor(contract: `0x${string}`, chain: Chain) {
    this.contract = contract
    this.chain = chain
    this.weth = WETH[chain.id].address
  }

  public async currencies(): Promise<Currency[]> {
    return [] as Currency[]
  }

  public async prices(): Promise<Prices> {
    if (this.chain.id === monadTestnet.id) {
      const {
        data: { monChartLogs, muBondChartLogs },
      } = await Subgraph.get<{
        data: {
          monChartLogs: { id: string; close: string }[]
          muBondChartLogs: { id: string; close: string }[]
        }
      }>(
        getSubgraphEndpoint({ chainId: this.chain.id }),
        '',
        '{ monChartLogs: chartLogs( first: 1 orderBy: timestamp orderDirection: desc where: {marketCode_in: ["0x0000000000000000000000000000000000000000/0xf817257fed379853cde0fa4f97ab987181b1e5ea", "0x0efed4d9fb7863ccc7bb392847c08dcd00fe9be2/0xf817257fed379853cde0fa4f97ab987181b1e5ea"]} ) { id close }, muBondChartLogs: chartLogs( first: 1 orderBy: timestamp orderDirection: desc where: {marketCode_in: ["0x0efed4d9fb7863ccc7bb392847c08dcd00fe9be2/0xf817257fed379853cde0fa4f97ab987181b1e5ea", "0x0efed4d9fb7863ccc7bb392847c08dcd00fe9be2/0xf817257fed379853cde0fa4f97ab987181b1e5ea"]} ) { id close } }',
        {},
      )
      const monPrice = Number(monChartLogs?.[0]?.close ?? 0)
      const muBondPrice = Number(muBondChartLogs?.[0]?.close ?? 0)
      return {
        [zeroAddress]: monPrice,
        [getAddress('0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701')]: monPrice,
        [getAddress('0x0EfeD4D9fB7863ccC7bb392847C08dCd00FE9bE2')]: muBondPrice,
      }
    }
    return {} as Prices
  }

  public async quote(
    inputCurrency: Currency,
    amountIn: bigint,
    outputCurrency: Currency,
  ): Promise<{
    amountOut: bigint
    gasLimit: bigint
    pathViz: PathViz | undefined
    aggregator: Aggregator
  }> {
    if (
      (isAddressEqual(inputCurrency.address, this.nativeTokenAddress) &&
        isAddressEqual(outputCurrency.address, this.weth)) ||
      (isAddressEqual(inputCurrency.address, this.weth) &&
        isAddressEqual(outputCurrency.address, this.nativeTokenAddress))
    ) {
      return {
        amountOut: amountIn,
        gasLimit: this.defaultGasLimit,
        pathViz: undefined,
        aggregator: this,
      }
    }

    try {
      const { takenAmount } = await getExpectedOutput({
        chainId: this.chain.id,
        inputToken: inputCurrency.address,
        outputToken: outputCurrency.address,
        amountIn: formatUnits(amountIn, inputCurrency.decimals),
        options: {
          // rpcUrl: RPC_URL[this.chain.id],
          useSubgraph: true,
        },
      })

      return {
        amountOut: parseUnits(takenAmount, outputCurrency.decimals),
        gasLimit: this.defaultGasLimit,
        pathViz: undefined,
        aggregator: this,
      }
    } catch {
      return {
        amountOut: 0n,
        gasLimit: this.defaultGasLimit,
        pathViz: undefined,
        aggregator: this,
      }
    }
  }

  public async buildCallData(
    inputCurrency: Currency,
    amountIn: bigint,
    outputCurrency: Currency,
    slippageLimitPercent: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _gasPrice: bigint,
    userAddress: `0x${string}`,
  ): Promise<{
    data: `0x${string}`
    gas: bigint
    value: bigint
    to: `0x${string}`
    nonce?: number
    gasPrice?: bigint
  }> {
    if (
      isAddressEqual(inputCurrency.address, this.nativeTokenAddress) &&
      isAddressEqual(outputCurrency.address, this.weth)
    ) {
      return {
        data: encodeFunctionData({
          abi: WETH_ABI,
          functionName: 'deposit',
        }),
        gas: this.defaultGasLimit,
        value: amountIn,
        to: WETH[this.chain.id].address,
      }
    } else if (
      isAddressEqual(inputCurrency.address, this.weth) &&
      isAddressEqual(outputCurrency.address, this.nativeTokenAddress)
    ) {
      return {
        data: encodeFunctionData({
          abi: WETH_ABI,
          functionName: 'withdraw',
          args: [amountIn],
        }),
        gas: this.defaultGasLimit,
        value: 0n,
        to: WETH[this.chain.id].address,
      }
    }

    const { transaction } = await marketOrder({
      chainId: this.chain.id,
      userAddress,
      inputToken: inputCurrency.address,
      outputToken: outputCurrency.address,
      amountIn: formatUnits(amountIn, inputCurrency.decimals),
      options: {
        rpcUrl: RPC_URL[this.chain.id],
        useSubgraph: true,
        slippage: slippageLimitPercent,
      },
    })
    return transaction
  }
}
