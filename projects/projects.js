import { fetchJSON, renderProjects } from '/lab1_dsc106/global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

// 🔧 Global state
let projects = [];
let query = '';
let selectedIndex = -1;
let currentChartData = [];
const colors = d3.scaleOrdinal(d3.schemeTableau10);

// 🔍 DOM Elements
const searchInput = document.querySelector('.searchBar');
const projectsContainer = document.querySelector('.projects');
const svg = d3.select('#projects-pie-plot');
const legend = d3.select('.legend');

// 📦 Load and initialize
projects = await fetchJSON('../lib/projects.json');
renderFilteredView();

// 🔍 Handle search input
searchInput.addEventListener('input', (event) => {
  query = event.target.value.toLowerCase();
  selectedIndex = -1; // reset pie selection on search
  renderFilteredView();
});

// 🔁 Core filtering logic
function getFilteredProjects() {
  const searchFiltered = projects.filter(project => {
    const values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query);
  });

  const finalFiltered = selectedIndex === -1
    ? searchFiltered
    : searchFiltered.filter(p => p.year === currentChartData[selectedIndex]?.label);

  return { searchFiltered, finalFiltered };
}

// 🧠 Master render function
function renderFilteredView() {
  const { searchFiltered, finalFiltered } = getFilteredProjects();
  renderProjects(finalFiltered, projectsContainer, 'h2');
  renderPieChart(searchFiltered);
}

// 🥧 Pie chart rendering
function renderPieChart(projectData) {
  const rolledData = d3.rollups(
    projectData,
    v => v.length,
    d => d.year
  );

  currentChartData = rolledData.map(([year, count]) => ({
    value: count,
    label: year
  }));

  const arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
  const sliceGenerator = d3.pie().value(d => d.value);
  const arcData = sliceGenerator(currentChartData);

  // 🧹 Clear previous chart
  svg.selectAll('*').remove();

  // 🖌️ Draw slices
  arcData.forEach((d, i) => {
    svg.append('path')
      .attr('d', arcGenerator(d))
      .attr('fill', colors(i))
      .attr('class', i === selectedIndex ? 'selected' : '')
      .attr('stroke', 'white')
      .attr('stroke-width', 1)
      .on('click', () => {
        selectedIndex = selectedIndex === i ? -1 : i;
        renderFilteredView();
      });
  });

  // 🧾 Draw legend
  legend.selectAll('*').remove();
  currentChartData.forEach((d, idx) => {
    legend.append('li')
      .attr('class', idx === selectedIndex ? 'legend-item selected' : 'legend-item')
      .attr('style', `--color: ${colors(idx)}`)
      .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
  });
}