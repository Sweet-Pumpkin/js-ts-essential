# 시작하기
## CH03 강의의 구조와 학습 환경
### 1. Visual Studio Code
### 2. Node js
#### 1) M1 homebrew install
```
/bin/bash -c "$(curl -fsSL https://gist.githubusercontent.com/nrubin29/bea5aa83e8dfa91370fe83b62dad6dfa/raw/48f48f7fef21abb308e129a80b3214c2538fc611/homebrew_m1.sh)"
```
`vi ~/.zshrc`로 들어가서 맨 마지막 줄에
```
eval $(/opt/homebrew/bin/brew shellenv)
```
#### 2) homebrew로 node 설치
```
brew install node
```
3. Parcel js
```
npm i -g parcel-bundler
```
4. Typescript
```
npm i -g typescript
// or
npm i typescript --save-dev
```