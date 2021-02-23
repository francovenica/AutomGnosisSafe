const wallet = {
  seed: 'range smoke crisp install cross shine hold grief ripple cabin sudden special', // it imports the wallet with "acc1" as owner
  password: 'password'
}

const privateKeys = {
  acc2: 'E0334B3F5CA1C4FBB26B3845F295DF12FE65EA052F31A5F800194958DCBDCB04',
  acc3: '3F23488883EE1A6346641D77ABF6ECDC78B03A0A9233EC6FAD1AB02FFC093CC5',
  acc4: '471F28E1C41C5FCF89A7BC76072F1A17644AE166F4FEBC31DAE2BAAF0AD8AA06'
}

const testAccountsHash = {
  safe1: '0x5BC79B27731589B43c51f745315ca899b4056f33', // safe own by acc1 to acc4.
  safe2: '0x9913B9180C20C6b0F21B6480c84422F6ebc4B808', // safe own by acc1 to acc4.
  acc1: '0x61a0c717d18232711bC788F19C9Cd56a43cc8872',
  acc2: '0x7724b234c9099C205F03b458944942bcEBA13408',
  acc3: '0x6E45d69a383CECa3d54688e833Bd0e1388747e6B',
  acc4: '0x730F87dA2A3C6721e2196DFB990759e9bdfc5083',
  acc5: '0x66bE167c36B3b75D1130BBbDec69f9f04E7DA4fC',
  non_owner_acc: '0xc8b99Dc2414fAA46E195a8f3EC69DD222EF1744F'
}

const safeNames = {
  load_safe_name: 'Autom Load Safe',
  create_safe_name: 'Autom Create Safe'
}

const accountNames = {
  owner_name: 'John Carmack',
  owner2_name: 'Gabe Newell',
  owner3_name: 'Hugo Martin',
  owner4_name: 'Hideo Kojima'
}

const otherAccountNames = { // Other names beyond the purpose of loading or creating safes
  owner5_name: 'Shigeru Miyamoto',
  owner6_name: 'Koji Igarashi'
}

export const accountsSelectors = {
  wallet,
  privateKeys,
  testAccountsHash,
  safeNames,
  accountNames,
  otherAccountNames
}
