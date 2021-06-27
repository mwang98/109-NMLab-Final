array=( App )
for i in "${array[@]}"
do
    # mv "${i}"/truffle-config.js "${i}"/truffle.js
    # rename back:
    mv "${i}"/truffle.js "${i}"/truffle-config.js
done
