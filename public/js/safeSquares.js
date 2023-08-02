const startingSquares = {
  "Mr. Green": "321,711",
  "Mrs.Peacock": "55.5,543",
  "Prof. Plum": "55.5,179",
  "Ms. Scarlet": "527.5,39",
  "Col. Mustard": "734,235",
  "Mrs. Black": "468.5,711",
};

const doorSquares = {
  "262,571": "Ball Room",
  "321,487": "Ball Room",
  "468.5,487": "Ball Room",
  "527.5,571": "Ball Room",
  "616,515": "Kitchen",
  "498,375": "Dining Room",
  "557,263": "Dining Room",
  "557,207": "Lounge",
  "409.5, 235": "Hall",
  "380, 235": "Hall",
  "291.5,151": "Hall",
  "262, 263": "Library",
  "85,347": "Billiard",
  "232.5,459": "Billiard",
  "203,571": "Conservatory",
};

const inRoomCoords = {
  Conservatory: ["173.5,655", "144,655"],
  Billiard: ["173.5,459", "144,459"],
  Library: ["173.5,291", "144,291"],
  Study: ["173.5,95", "144,95"],
  Hall: ["409.5,95", "380,95"],
  Lounge: ["675,95", "645.5,95"],
  DiningRoom: ["704.5,375", "704.5,403"],
  Kitchen: ["704.5,655", "675,655"],
};

const squares = [
  "321,711",
  "321,683",
  "291.5,683",
  "262,683",
  "262,655",
  "262,627",
  "262,599",
  "262,571",
  "262,543",
  "262,515",
  "262,487",
  "262,459",
  "262,431",
  "262,403",
  "262,375",
  "262,347",
  "262,319",
  "262,291",
  "262,263",
  "262,235",
  "262,207",
  "262,179",
  "262,151",
  "262,123",
  "262,95",
  "262,67",
  "262,39",
  "291.5,67",
  "291.5,95",
  "291.5,123",
  "291.5,151",
  "291.5,179",
  "291.5,207",
  "291.5,235",
  "291.5,263",
  "291.5,291",
  "291.5,319",
  "291.5,347",
  "291.5,375",
  "291.5,403",
  "291.5,431",
  "291.5,459",
  "291.5,487",
  "232.5,487",
  "232.5,515",
  "232.5,543",
  "232.5,571",
  "232.5,599",
  "232.5,627",
  "232.5,655",
  "203,571",
  "203,543",
  "203,515",
  "173.5,515",
  "144,515",
  "114.5,515",
  "85,515",
  "85,543",
  "55.5,543",
  "114.5,543",
  "144,543",
  "173.5,543",
  "232.5,459",
  "232.5,431",
  "232.5,403",
  "232.5,375",
  "232.5,347",
  "232.5,319",
  "203,347",
  "173.5,347",
  "144,347",
  "114.5,347",
  "85,347",
  "232.5,151",
  "203,151",
  "173.5,151",
  "144,151",
  "114.5,151",
  "85,151",
  "85,179",
  "55.5,179",
  "114.5,179",
  "144,179",
  "173.5,179",
  "203,179",
  "232.5,179",
  "321,235",
  "350.5,235",
  "380,235",
  "409.5,235",
  "439,235",
  "468.5,235",
  "498,235",
  "498,207",
  "498,179",
  "498,151",
  "498,123",
  "498,95",
  "498,67",
  "498,263",
  "498,263",
  "498,291",
  "498,319",
  "498,347",
  "498,375",
  "498,403",
  "498,431",
  "498,459",
  "498,487",
  "468.5,487",
  "439,487",
  "409.5,487",
  "380,487",
  "350.5,487",
  "321,487",
  "321,459",
  "350.5,459",
  "380,459",
  "409.5,459",
  "439,459",
  "468.5,459",
  "468.5,431",
  "468.5,403",
  "468.5,375",
  "468.5,347",
  "468.5,319",
  "468.5,291",
  "468.5,263",
  "527.5,67",
  "527.5,39",
  "527.5,95",
  "527.5,123",
  "527.5,151",
  "527.5,179",
  "527.5,207",
  "527.5,235",
  "527.5,263",
  "557,263",
  "586.5,263",
  "616,263",
  "645.5,263",
  "675,263",
  "704.5,263",
  "704.5,235",
  "734,235",
  "675,235",
  "645.5,235",
  "616,235",
  "586.5,235",
  "557,235",
  "557,207",
  "586.5,207",
  "616,207",
  "645.5,207",
  "675,207",
  "704.5,207",
  "527.5,459",
  "557,459",
  "586.5,459",
  "586.5,487",
  "557,487",
  "527.5,487",
  "616,487",
  "645.5,487",
  "675,487",
  "704.5,487",
  "704.5,515",
  "734,515",
  "675,515",
  "645.5,515",
  "616,515",
  "586.5,515",
  "557,515",
  "527.5,515",
  "527.5,543",
  "527.5,571",
  "527.5,599",
  "527.5,627",
  "527.5,655",
  "527.5,683",
  "557,543",
  "557,571",
  "557,599",
  "557,627",
  "557,655",
  "498,683",
  "468.5,683",
  "468.5,711",
];

const playableSquares = new Set(squares);