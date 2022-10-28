document.getElementById(`time`).innerText = `${new URLSearchParams(window.location.search).get(`t`)} seconds`

document.getElementById(`tweet`).addEventListener('click', function(e) {
  window.open(`https://twitter.com/intent/tweet?text=I just finished @coding398's labyrinth in ${new URLSearchParams(window.location.search).get(`t`)} seconds!&url=https://replit.com/@codingMASTER398/The-labyrinth?v=1`)
})