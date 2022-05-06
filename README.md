# Hackathons
This repo serves to store previous hackathons and bootstrap new ones.

## Sparse Checkout
If you want to get only a specific folder

```
mkdir hackathons
cd hackathons
git init
git remote add -f origin https://github.com/jpldcarvalho/hackathons
git config core.sparseCheckout true
echo "<DIRECTORY YOU WANT>" >> .git/info/sparse-checkout
git pull origin master
```