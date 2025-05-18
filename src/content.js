async function main() {
    console.log(await getBasicRecords());
    console.log(await getAllRecordsBySearch());
}
main();