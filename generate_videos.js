const categories = ['trending','top-rated','action','comedy','originals','sci-fi','drama','documentary'];
const types = ['Movie','Series','Short'];
const genres = ['Action','Comedy','Sci-Fi','Drama','Thriller','Animation','Documentary','Fantasy','Adventure','Horror'];
const ratings = ['G','PG','PG-13','R','TV-14','TV-MA'];
const names = ['Alpha','Beta','Gamma','Delta','Epsilon','Zeta','Eta','Theta','Iota','Kappa','Lambda','Mu','Nu','Xi','Omicron','Pi','Rho','Sigma','Tau','Upsilon','Phi','Chi','Psi','Omega'];
const suffixes = ['Rising','Fallen','Legacy','Chronicles','Saga','Reborn','Origins','Frontier','Paradox','Venture','Quest','Realm','Dimension','Horizon','Epoch'];

let videos = [];
let id = 300;

// Generate 30 for each category
categories.forEach(cat => {
  for(let i=0; i<30; i++) {
    const name = names[Math.floor(Math.random()*names.length)] + ' ' + suffixes[Math.floor(Math.random()*suffixes.length)];
    videos.push({
      id: id++,
      title: `${name} ${i+1}`,
      genre: genres[Math.floor(Math.random()*genres.length)],
      type: types[Math.floor(Math.random()*types.length)],
      language:'English',
      rating: ratings[Math.floor(Math.random()*ratings.length)],
      duration: `${Math.floor(Math.random()*120)+30} min`,
      year: 2022 + Math.floor(Math.random()*5),
      description: `Official ${cat} category video #${i+1}. Experience premium streaming quality with this exclusive title.`,
      cast: ['Various Artists'],
      thumbnail: `https://picsum.photos/seed/vid${id}/400/600`,
      banner: `https://picsum.photos/seed/vid${id}banner/1400/700`,
      videoUrl: `https://samplelib.com/lib/preview/mp4/sample-${[5,10,15,20][Math.floor(Math.random()*4)]}s.mp4`,
      categories: [cat],
      featured: false
    });
  }
});

// Generate 30 for each type
types.forEach(type => {
  for(let i=0; i<30; i++) {
    const name = names[Math.floor(Math.random()*names.length)] + ' ' + suffixes[Math.floor(Math.random()*suffixes.length)];
    videos.push({
      id: id++,
      title: `${type} Collection ${i+1}`,
      genre: genres[Math.floor(Math.random()*genres.length)],
      type: type,
      language:'English',
      rating: ratings[Math.floor(Math.random()*ratings.length)],
      duration: type === 'Short' ? `${Math.floor(Math.random()*25)+5} min` : type === 'Series' ? `${Math.floor(Math.random()*30)+20} min` : `${Math.floor(Math.random()*120)+60} min`,
      year: 2022 + Math.floor(Math.random()*5),
      description: `Premium ${type.toLowerCase()} content #${i+1}. Best in class entertainment experience.`,
      cast: ['Various Artists'],
      thumbnail: `https://picsum.photos/seed/${type.toLowerCase()}${id}/400/600`,
      banner: `https://picsum.photos/seed/${type.toLowerCase()}${id}banner/1400/700`,
      videoUrl: `https://samplelib.com/lib/preview/mp4/sample-${[5,10,15,20][Math.floor(Math.random()*4)]}s.mp4`,
      categories: [categories[Math.floor(Math.random()*categories.length)]],
      featured: false
    });
  }
});

console.log(JSON.stringify(videos, null, 2));