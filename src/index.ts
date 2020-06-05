import * as CryptoJS from 'crypto-js';

class Block {
  static calculateBlockHash = (
    index: number,
    previousHash: string,
    data: string,
    timestamp: number,
  ): string =>
    CryptoJS.SHA256(index + previousHash + data + timestamp).toString();

  static vaildateStructure = (block: Block): boolean =>
    typeof block.index === 'number' &&
    typeof block.hash === 'string' &&
    typeof block.previousHash === 'string' &&
    typeof block.data === 'string' &&
    typeof block.timestamp === 'number';

  public index: number;
  public hash: string;
  public previousHash: string;
  public data: string;
  public timestamp: number;

  constructor(
    index: number,
    hash: string,
    previousHash: string,
    data: string,
    timestamp: number,
  ) {
    this.index = index;
    this.hash = hash;
    this.previousHash = previousHash;
    this.data = data;
    this.timestamp = timestamp;
  }
}

const genesisBlock: Block = new Block(0, '1414141', '', 'first block', 12345);

const blockChain: Block[] = [genesisBlock];

const getBlockChain = (): Block[] => blockChain;

const getLatestBlock = (): Block => blockChain[blockChain.length - 1];

const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 1000);

// arg : data / newIdx, previousHash(= lastestHash), newTimestamp
// return 타입, args 타입 명시
const createNewBlock = (data: string): Block => {
  const previousBlock: Block = getLatestBlock();
  const previousHash: string = previousBlock.hash;
  const newIdx: number = previousBlock.index + 1;
  const newTimestamp: number = getNewTimeStamp();
  const newBlockHash: string = Block.calculateBlockHash(
    newIdx,
    previousHash,
    data,
    newTimestamp,
  );
  const newBlock: Block = new Block(
    newIdx,
    newBlockHash,
    previousHash,
    data,
    newTimestamp,
  );
  addBlock(newBlock);
  return newBlock;
};

const getBlockHash = (aBlock: Block): string => {
  return Block.calculateBlockHash(
    aBlock.index,
    aBlock.previousHash,
    aBlock.data,
    aBlock.timestamp,
  );
};

const isValidBlock = (candidateBlock: Block, previousBlock: Block): boolean => {
  if (!Block.vaildateStructure(candidateBlock)) {
    return false;
  } else if (previousBlock.index + 1 !== candidateBlock.index) {
    return false;
  } else if (previousBlock.hash !== candidateBlock.previousHash) {
    return false;
  } else if (getBlockHash(candidateBlock) !== candidateBlock.hash) {
    return false;
  } else {
    return true;
  }
};

const addBlock = (candidateBlock: Block): void => {
  if (isValidBlock(candidateBlock, getLatestBlock())) {
    blockChain.push(candidateBlock);
  }
};

createNewBlock('second block');
createNewBlock('third block');

console.log(blockChain);

export {};
