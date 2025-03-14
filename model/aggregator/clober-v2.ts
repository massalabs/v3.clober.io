import {
  createPublicClient,
  encodeFunctionData,
  getAddress,
  http,
  isAddressEqual,
  parseUnits,
  PublicClient,
  zeroAddress,
} from 'viem'
import { getExpectedOutput, marketOrder } from '@clober/v2-sdk'

import { Currency } from '../currency'
import { Prices } from '../prices'
import { PathViz } from '../pathviz'
import { RPC_URL } from '../../constants/rpc-urls'
import { formatUnits } from '../../utils/bigint'
import { WETH } from '../../constants/currency'
import { WETH_ABI } from '../../abis/weth-abi'
import { Chain } from '../chain'
import { Subgraph } from '../../constants/subgraph'
import { monadTestnet } from '../../constants/monad-testnet-chain'

import { Aggregator } from './index'

export class CloberV2Aggregator implements Aggregator {
  public readonly name = 'CloberV2'
  public readonly baseUrl = ''
  public readonly contract: `0x${string}`
  private readonly nativeTokenAddress = zeroAddress
  public readonly chain: Chain
  public readonly weth: `0x${string}`

  private publicClient: PublicClient
  private defaultGasLimit = 500_000n

  constructor(contract: `0x${string}`, chain: Chain) {
    this.contract = contract
    this.chain = chain
    this.weth = WETH[chain.id].address
    this.publicClient = createPublicClient({
      chain,
      transport: http(RPC_URL[chain.id]),
    })
  }

  public async currencies(): Promise<Currency[]> {
    return [] as Currency[]
  }

  public async prices(): Promise<Prices> {
    if (this.chain.id === monadTestnet.id) {
      const {
        data: { chartLogs },
      } = await Subgraph.get<{
        data: { chartLogs: { id: string; close: string }[] }
      }>(
        'https://api.goldsky.com/api/public/project_clsljw95chutg01w45cio46j0/subgraphs/v2-core-subgraph-monad-testnet/v1.0.0/gn',
        '',
        '{ chartLogs( first: 1 orderBy: timestamp orderDirection: desc where: {marketCode: "0x0000000000000000000000000000000000000000/0xf817257fed379853cde0fa4f97ab987181b1e5ea"} ) { id close } }',
        {},
      )
      const price = Number(chartLogs?.[0]?.close ?? 0)
      return {
        [zeroAddress]: price,
        [getAddress('0x760AfE86e5de5fa0Ee542fc7B7B713e1c5425701')]: price,
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
