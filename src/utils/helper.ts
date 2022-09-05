import { Address } from '@graphprotocol/graph-ts'
import { StakeManager } from '../types/StakeManager/StakeManager'

const stakeManagerAddress = '0x0000000000000000000000000000000000001001'
export const stakemanager = StakeManager.bind(Address.fromString(stakeManagerAddress))
