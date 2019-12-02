function build2dArray(numOfRows, numOfCols) {
	const matrix = new Array(numOfRows);

	let i = -1;
	while (++i < numOfRows) {
		matrix[i] = new Array(numOfCols);
	}
	return matrix;
}

a = build2dArray(5, 5);

console.log(a);