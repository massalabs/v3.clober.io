import axios from 'axios'

export class Subgraph {
  public static async get<T>(
    uri: string,
    operationName: string,
    query: string,
    variables: {},
  ): Promise<T> {
    const response = await axios.post(
      uri,
      {
        query,
        variables,
        operationName,
      },
      {
        timeout: 5 * 1000,
      },
    )

    if (response.status === 200) {
      return response.data
    } else {
      throw new Error((response.data as any).errors || 'Failed to fetch data')
    }
  }
}
