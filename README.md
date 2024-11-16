# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
```

빌드 순서

1. 컨트랙트 컴파일
   
```shell
npx hardhat compile
```

2. 테스트 실행

```shell
npx hardhat test
```

3. 모듈 배포 전 환경변수 설정
   - 환경변수 파일 생성 (.env)
   - 환경변수 파일 내용 수정
  
# 0. 초기 설정
# 배포 지갑 private key (노출 안되게 보안유지)
#PRIVATE_KEY="87d789931dcb6784702ffcf4c57e97ec1a4de4344d1286f41105498feeb924ce"
PRIVATE_KEY="ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"

# Chainlink Price Feed Info
#ETH_MAINNET_CHAINLINK_PRICE_FEED="0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419"
#ETH_SEPOLIA_CHAINLINK_PRICE_FEED="0x694AA1769357215DE4FAC081bf1f309aDC325306"
CHAINLINK_PRICE_FEED_ADDRESS=0x694AA1769357215DE4FAC081bf1f309aDC325306

# USDT contract address
USDT_ADDRESS=0x68B1D87F95878fE05B998F19b66F4baba5De1aed
# USDC contract address
USDC_ADDRESS=0x833589fCD6eDb6E08B1Daf2EbB44C97a9D4C8491
  
# 컨트랙트 배포 (Ignition 모듈 사용)

```shell
npx hardhat run ./scripts/ignition/deploy_all.js --network (localhost | sepolia | mainnet)
```

** Ignition 모듈을 사용하는 이유 **
배포 후에 verify를 쉽게 할 수 있다.

```shell
npx hardhat ignition verify chain-{11155111 | 11155428 | 1}
```




# 컨트랙트 업그레이드 

Ignition 모듈 사용하지 않고 아래 참고.


# 1. 컨트랙트 배포

컨트랙트 배포는 ignition 모듈을 사용하지 않음.
** 단, 스크립트로 배포 시 실행 할 때마다 새로운 컨트랙트 주소가 생성되므로 주의 **

## 1.1. 단일 배포

** 단일 배포 시 배포 후 컨트랙트 주소를 환경변수에 저장 **


### 1.1.1. Token 배포

```shell
npx hardhat run ./scripts/deploy_token.js --network (localhost | sepolia | mainnet)
```

### 1.1.2. Presale 배포

```shell
npx hardhat run ./scripts/deploy_presale.js --network (localhost | sepolia | mainnet)
```

### 1.1.3. Staking Manager 배포

```shell
npx hardhat run ./scripts/deploy_staking.js --network (localhost | sepolia | mainnet)
```

## 1.2. 한번에 배포

** 한번에 배포 시 배포 컨트랙트 주소는 환경변수 설정 필요 없음. 단, 배포 후에는 환경변수 설정 필요 **

### 1.2.1. Token, Presale, Staking Manager 컨트랙트 한번에 배포

```shell
npx hardhat run ./scripts/deploy_all.js --network (localhost | sepolia | mainnet)
```

# 2. 컨트랙트 업그레이드

업그레이드는 기존 컨트랙트의 기능 및 변수를 추가한 경우 Proxy를 통해 업그레이드 진행
** 업그레이드 할 컨트랙트에 새로 추가되는 변수는 기존 컨트랙트 변수 마지막에 추가 **

** 업그레이드 전 환경변수 확인 필수 **

## 2.1. 업그레이드 순서

1. 컨트랙트 컴파일

```shell
npx hardhat compile
```

2. ./scripts/upgrade_xxx.js 파일 확인
    - 업그레이드 할 내용 수정

3. 업그레이드 스크립트 실행

```shell
npx hardhat run ./scripts/upgrade_XXX.js --network (localhost | sepolia | mainnet)
```

-==============================================================================





### 참고

- ignition 리셋
ignition 리셋은 ignition 모듈 배포 후 컨트랙트 주소가 변경되는 경우 사용
ignition/deployments/chain-31337 -> deploymentId :  chain-31337
ignition/deployments/chain-31337/journal.jsonl -> futureId : TokenModule#Token

```shell
npx hardhat ignition wipe chain-31337 TokenModule#Token
```

- 스크립트로 배포 시 오류
HardhatPluginError: The deployment wasn't run because of the following reconciliation errors:

  * TokenModule#Token: Argument at index 2 has been changed
    => 원인: 이전 배포한 매개변수 값과 다르면 배포 오류 발생
    => 해결: 이전 배포한 매개변수 값과 동일하게 설정 또는 ignition 리셋 후 재배포


