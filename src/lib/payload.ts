import { getPayload } from 'payload'
import config from '@payload-config'

/** Local API — frontend czyta dane w tym samym procesie Workera, bez sieci. */
export const getPayloadClient = async () => {
  const payloadConfig = await config
  return getPayload({ config: payloadConfig })
}
