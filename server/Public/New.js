
let fn1 = () => {
    return console.log(55);
}


let fn2 = () => {
    return console.log(33);
}


let fn = () => {
    console.log(1);
    console.log(2);
    fn1()
    console.log(3);
    console.log(4);
    fn2()
    console.log(5);
    console.log(6);
    return console.log("these are the numbers");
}

fn();