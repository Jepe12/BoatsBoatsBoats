function* autoGen(startNum){
    var counter = startNum ?? 1;
    while(true){
        yield counter;
        counter++;
    }
}
    