# Solana Candy Machine Setup & Deployment

This guide assumes you are running Ubuntu 21.04 or equivalent. For Windows users, WSL is a no-brainer. MacOS will require minor changes in installing some of the prerequisites.

## Requirements Setup

### Installing Node v14.x and yarn v1.22.x.

```
$ cd ~
$ curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh
$ sudo bash nodesource_setup.sh
```

```
$ curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
$ echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
$ sudo apt remove cmdtest # cmdtest sometimes interferes with yarn installation
$ sudo apt update && sudo apt install yarn
```

Ensure you are running the correct package versions:
```
$ node -v && yarn -v
```

### Solana CLI Tools

Install the Solana CLI tools:

```
$ sh -c "$(curl -sSfL https://release.solana.com/v1.7.14/install)"
```

Update your PATH as directed to include the Solana CLI directory. 
Confirm installation was successful:

```
$ solana --version
```

### ts-node

Install ts-node:

```
$ npm install -g ts-node
```

Confirm:

```
$ ts-node -v
```

## Solana CLI Configuration
 
Generate a new keypair for the treasury wallet:

```
$ solana-keygen new --outfile ~/.config/solana/main.json
```

**IMPORTANT: ENCRYPT YOUR SEEDPHRASE AND SAVE IT TO A SAFE LOCATION**

Set the default network to devnet:

```
$ solana config set --url https://api.devnet.solana.com
```

Set the default keypair:

```
$ solana config set --keypair ~/.config/solana/main.json
```

Fund your wallet on the devnet:

```
$ solana airdrop 1 # 1 SOL seems to be the limit per request
```

Confirm:

```
$ solana balance
```

## Metaplex Setup

Clone the repository:

```
$ cd ~
$ git clone https://github.com/metaplex-foundation/metaplex.git
```

Set up the environment:

```
$ cd metaplex/js/packages/cli
$ echo "alias metaplex='ts-node ~/metaplex/js/packages/cli/src/candy-machine-cli.ts'" >> ~/.bash_aliases
$ source ~/.bash_aliases
$ metaplex -V
```

### Assets & Metadata

All files must be zero-indexed and come in pairs (ex. 0.png, 0.json, 1.png, 1.json...)

Here is a working template for the metadata:
```
{
  "name": "Honeybee #1",
  "symbol": "",
  "description": "Honey DeFi NFTs are super cool!",
  "image": "placeholder.png",
  "date": 1633216769,
  "seller_fee_basis_points": 0,
  "external_url": "",
  "attributes": [
    {
      "trait_type": "Background",
      "value": "bg1"
    },
    {
      "trait_type": "Wings",
      "value": "wings10"
    },
    {
      "trait_type": "Body",
      "value": "body1"
    },
    {
      "trait_type": "Head",
      "value": "head2"
    },
    {
      "trait_type": "Paint",
      "value": "pain1"
    },
    {
      "trait_type": "Eyes",
      "value": "eyes1"
    },
    {
      "trait_type": "Antenna",
      "value": "antenna10"
    },
    {
      "trait_type": "Mouth",
      "value": "mouth1"
    },
    {
      "trait_type": "Fluff",
      "value": "fluff10"
    },
    {
      "trait_type": "Legs",
      "value": "leg1"
    }
  ],
  "collection": {
    "name": "Honey NFT Collection #1",
    "family": "Honey NFTs" 
 },
  "properties": {
    "files": [
     {
       "uri": "placeholder.png",
       "type": "image/png"
     }
   ],
    "category": "image",
    "creators": [
     {
       "address": "<TREASURY_ADDRESS>",
       "share": 100
     }
   ]
  }
}
```

`date` is the Unix epoch when minting will start.

`image`, `external_url` and `properties.files.uri` are placeholders and will be replaced by Metaplex automatically.

`seller_fee_basis_points` denotes the royalty that will be collected on all secondary sales (resales on marketplaces). 10000=100%.

The `properties.creators` array sets the royalty splits of the above to selected adresses. `share` is a percentage of the total royalties collected. 100=100%.

### Uploading the assets to IPFS

Create a new project on [infura.io/dashboard/ipfs](https://infura.io/dashboard/ipfs) and save the `PROJECT ID` and `PROJECT SECRET` in a safe place.

Copy/move all your assets to the working directory:

```
$ mkdir ~/metaplex/js/packages/cli/assets
$ cp <ASSETS_DIR>/* ~/metaplex/js/packages/cli/assets/
```

Confirm all the assets are present in the root of the `assets` directory and sequential:

```
$ ls -1 | sort -n
```

I recommend initially doing the next steps with a small sample of assets as it takes quite a while — 50-100 pairs of png/json files should do for now.

Upload the assets to Infura IPFS:

```
$ metaplex upload --env devnet --keypair ~/.config/solana/main.json -s ipfs --ipfs-infura-project-id <PROJECT_ID> --ipfs-infura-secret <PROJECT_SECRET> ./assets/
```

_Note: if anything goes wrong here, delete the .cache/ directory before trying again._

Verify the upload was successful:

```
$ metaplex verify -k ~/.config/solana/main.json -e devnet
```

Create a candy machine:

```
$ metaplex create_candy_machine -k ~/.config/solana/main.json -e devnet -p <MINT_PRICE>
```

**IMPORTANT: NOTE DOWN THE CANDY MACHINE PUBKEY, THIS WILL BE USED TO SET UP THE MINTING APP LATER**

Update the candy machine to include a start date and note down the timestamp; if the set date is in the past, minting will be enabled immediately:

```
$ metaplex update_candy_machine -k ~/.config/solana/main.json -e devnet -d "01 Oct 2021 00:00:00 GMT"
```

Print out the cached data and note down the `config` element:

```
$ cat ./.cache/*temp | grep config
```

## Setting up the front end

Clone [github.com/exiled-apes/candy-machine-mint.git](https://github.com/exiled-apes/candy-machine-mint.git) or `cd` into an existing directory. 

```
$ cd ~/candy-machine-mint_honey
```

Copy the example `.env` file and edit it using your editor of choice:

```
$ cp .env{.example,}
$ vim .env
```

This is how it should look:
```
REACT_APP_CANDY_MACHINE_CONFIG=<CANDY_MACHINE_CONFIG>
REACT_APP_CANDY_MACHINE_ID=<CANDY_MACHINE_PUBKEY>
REACT_APP_TREASURY_ADDRESS=<TREASURY_ADDRESS>
REACT_APP_CANDY_START_DATE=<START_DATE>

REACT_APP_SOLANA_NETWORK=devnet
REACT_APP_SOLANA_RPC_HOST=https://explorer-api.devnet.solana.com
```

The treasury address needs to be the same as the one that created the candy machine.

Install the requirements, build the react app and run it:

``` 
$ yarn install
$ yarn build
$ yarn start
```

This should automatically load the minting app in your browser at localhost:3000. Confirm everything is working as expected.

_Note: sending NFTs to other addresses doesn't seem to work on the devnet._

## Deploying to mainnet

After testing on the devnet, repeat all the steps from the Metaplex setup onwards. Deploy the react app to Github Pages, Vercel, Netlify, or self-host it using a reverse proxy.