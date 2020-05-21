function Shuffle(array) {
	let counter = array.length;
	while (counter > 1) {
		let index = Math.floor(Math.random()*counter);
		if (index != 0) {
			counter--;
			let temp = array[counter];
			array[counter] = array[index];
			array[index] = temp;
		}
	}
	return array;
}
module.exports = Shuffle;
