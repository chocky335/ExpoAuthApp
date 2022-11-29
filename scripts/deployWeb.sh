#!/usr/bin/env bash

# Environment
BUILD_DIR="web-build"
RELEASE_BRANCH="gh-pages"
VERSION=$(grep version package.json | awk -F \" '{print $4}')
DOMAIN=$(grep homepage package.json | awk -F \" '{print $4}')


# Script
expo export:web
(cd $BUILD_DIR && ln -s index.html 404.html)
echo $DOMAIN > $BUILD_DIR/CNAME
git fetch origin $RELEASE_BRANCH
git add -f $BUILD_DIR
tree=$(git write-tree --prefix=$BUILD_DIR)
git reset -- $BUILD_DIR
identifier=$(git describe --dirty --always)
commit=$(git commit-tree -p refs/remotes/origin/$RELEASE_BRANCH -m "Deploy $identifier as v$VERSION" $tree)
git update-ref refs/heads/$RELEASE_BRANCH $commit
git tag -a "v$VERSION" -m "Release tag for $VERSION" $commit
git push --follow-tags origin refs/heads/$RELEASE_BRANCH