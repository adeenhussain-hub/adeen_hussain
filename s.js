// function descendingOrder() {
//     let a = 1234
//     let b;
//     for (let i = 0; i == a.length; i++) {
//         b = a[i]
//         return console.log(b)
//     }
// }
// let s = descendingOrder();
function digitize(n) {
  //code here
  let array = [];
  let s = n.toString();
  
  for(let i = s.length -1; i >=0; i--){ 
    // s.toInt();
    array.push(s[i])
  }
    return array.toLocaleString();  
}
console.log(digitize(35231))
