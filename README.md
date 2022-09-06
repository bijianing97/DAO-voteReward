# DAO-voteRewards
This a subgraph for rei voteRewards service

## entities

- Voter
```ts
  type Voter @entity {
  id: ID!
  timestamp: BigInt!
  voterInfo: [VoterInfo!]!
}
```
call example
```sh
curl -X POST -d '{ "query": "{voters(first:1,orderBy:timestamp,orderDirection:desc) {id,timestamp,voterInfo{id,cost,timestamp,commissionAddress}}}"}' http://localhost:8000/subgraphs/name/voteReward | json_pp
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   462  100   331  100   131  41375  16375 --:--:-- --:--:-- --:--:-- 57750
{
   "data" : {
      "voters" : [
         {
            "id" : "0x92c51c5a9cd4717ffdb169307428ddb7e27ecb4d",
            "timestamp" : "1662430448",
            "voterInfo" : [
               {
                  "commissionAddress" : "0x9b2bc49960731e072328ccb5514c10e9ec4c55e7",
                  "cost" : "495200000000000000000000",
                  "id" : "0x92c51c5a9cd4717ffdb169307428ddb7e27ecb4d-0x66f6f8f219e84df774d34414c86658ce2dee617d",
                  "timestamp" : "1662430448"
               }
            ]
         }
      ]
   }
}

```

- VoterInfo
```ts
  type VoterInfo @entity {
  id: ID!
  cost: BigInt!
  timestamp: BigInt!
  commissionAddress: String!
}
```
call example
```sh
curl -X POST -d '{ "query": "{voterInfo(id:\"0x92c51c5a9cd4717ffdb169307428ddb7e27ecb4d-0x66f6f8f219e84df774d34414c86658ce2dee617d\") {id,cost,timestamp,commissionAddress}}"}' http://localhost:8000/subgraphs/name/voteReward | json_pp
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   398  100   241  100   157  60250  39250 --:--:-- --:--:-- --:--:-- 99500
{
   "data" : {
      "voterInfo" : {
         "commissionAddress" : "0x9b2bc49960731e072328ccb5514c10e9ec4c55e7",
         "cost" : "495200000000000000000000",
         "id" : "0x92c51c5a9cd4717ffdb169307428ddb7e27ecb4d-0x66f6f8f219e84df774d34414c86658ce2dee617d",
         "timestamp" : "1662430448"
      }
   }
}
```
