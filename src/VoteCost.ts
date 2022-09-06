import { Address, BigInt } from '@graphprotocol/graph-ts'
import { Voter, VoterInfo } from './types/schema'
import { stakemanager } from './utils/helper'
import { ERC20 } from './types/StakeManager/ERC20'
import { Stake, StartUnstake } from './types/StakeManager/StakeManager'

export function handleStake(event: Stake): void {
  const voterID = event.params.to.toHex()
  const voterInfoID = `${event.params.to.toHex()}-${event.params.validator.toHex()}`
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
  const voterInfoID = `${event.transaction.from.toHex()}-${event.params.validator.toHex()}`
  const voter = Voter.load(voterID)
  const voterInfo = VoterInfo.load(voterInfoID)
  if (!voter || !voterInfo) {
    return
  }
  const sharesAddress = voterInfo.commissionAddress
  const shareContract = ERC20.bind(Address.fromString(sharesAddress))
  const sharesAmount = shareContract.balanceOf(Address.fromString(voterID))
  if (sharesAmount.gt(BigInt.fromI32(0))) {
    const shareToRei = stakemanager.estimateSharesToAmount(event.params.validator, sharesAmount)
    voterInfo.cost = voterInfo.cost.ge(shareToRei) ? sharesAmount : voterInfo.cost
  } else {
    voterInfo.cost = BigInt.fromI32(0)
  }
  voterInfo.save()
}
