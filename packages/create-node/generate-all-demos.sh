#! /bin/bash

mkdir -p /tmp/demo
rm -rf /tmp/demo/*

npm run build

local_folder=$(pwd)

package_managers=(
  npm
  # pnpm
  # yarn
)

languages=(
  # coffee
  js
  ts
)

test_frameworks=(
  vitest
  # # ava
  jest
  # # mocha
)

targets=(
  # all
  cjs
  esm
  # bun
  # browser
  # deno
)

for package_manager in ${package_managers[@]}; do
  for language in ${languages[@]}; do
    for test_framework in ${test_frameworks[@]}; do
      for target in ${targets[@]}; do

  project_path=/tmp/demo/$package_manager-$language-$test_framework-$target

  echo
  echo
  echo
  echo -e "\033[31m#############################################################\033[0m"
  echo -e "\033[31m# \033[0m"
  echo -e "\033[31m# Creating project in $project_path\033[0m"
  echo -e "\033[31m# \033[0m"
  echo -e "\033[31m#############################################################\033[0m"
  echo
  echo

  LOG_LEVEL=debug SKIP_PM_INIT=1 \
    ./bin/create-node.js $project_path \
      --package-manager ${package_manager} \
      --language $language \
      --test-framework $test_framework \
      --target $target

  cd $project_path

  if [[ "$target" == "esm" ]]; then
    package_json=$(cat package.json)
    echo "$package_json" | jq '. + {type: "module"}' > package.json
  fi

  npm run test

  cd $local_folder

      done
    done
  done
done


echo
echo
echo
echo -e "\033[31m> All generated\033[0m"
echo
echo
