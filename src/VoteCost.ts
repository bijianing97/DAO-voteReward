import { Address, BigInt, Bytes } from '@graphprotocol/graph-ts'
import { Voter, VoterInfo, unInfo } from './types/schema'
import { stakemanager } from './utils/helper'
import { ERC20 } from './types/StakeManager/ERC20'
import { Stake, StartUnstake } from './types/StakeManager/StakeManager'

export function handleStake(event: Stake): void {
  const voterID = event.params.to.toHex()
  const voterInfoID = `${event.params.to.toHex()}-${event.params.validator.toHex()}-add`
  let voter = Voter.load(voterID)
  if (voter) {
    let voterInfo = VoterInfo.load(voterInfoID)
    if (voterInfo) {
      voterInfo.cost = voterInfo.cost.plus(event.params.value)
    } else {
      voterInfo = new VoterInfo(voterInfoID)
      voterInfo.cost = event.params.value
      voterInfo.timestamp = event.block.timestamp
      voterInfo.commissionAddress = stakemanager.validators(event.params.validator).value1.toHex()
      const voterInfos = voter.voterInfo
      voterInfos.push(voterInfo.id)
      voter.voterInfo = voterInfos
    }
    voterInfo.save()
    voter.save()
  } else {
    voter = new Voter(voterID)
    const voterInfo = new VoterInfo(voterInfoID)
    voterInfo.cost = event.params.value
    voterInfo.timestamp = event.block.timestamp
    voterInfo.commissionAddress = stakemanager.validators(event.params.validator).value1.toHex()
    const voterInfos = [voterInfo.id]
    voter.voterInfo = voterInfos
    voter.timestamp = event.block.timestamp
    voterInfo.save()
    voter.save()
  }
}

export function handleStartUnstake(event: StartUnstake): void {
  const voterID = event.transaction.from.toHex()
  const voterInfoID = `${event.transaction.from.toHex()}-${event.params.validator.toHex()}-remove`
  const voterInfoIDAdd = `${event.transaction.from.toHex()}-${event.params.validator.toHex()}-add`
  // const voter = Voter.load(voterID)
  const uninfo = new unInfo(voterInfoID)
  const voterInfoAdd = VoterInfo.load(voterInfoIDAdd)
  const sharesAddress = voterInfoAdd!.commissionAddress

  uninfo.timestamp = event.block.timestamp
  uninfo.commissionAddress = sharesAddress
  const balance = ERC20.bind(Address.fromString(sharesAddress)).balanceOf(Address.fromString(voterID))
  uninfo.balance = balance
  uninfo.sharesAmount = stakemanager.estimateSharesToAmount(event.params.validator, balance)
  uninfo.costAmout = BigInt.fromI32(0)

  uninfo.save()
}
