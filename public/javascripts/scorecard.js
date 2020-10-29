const holeScoreEl = document.getElementById('hole-score')
const upEl = document.getElementById('up')
const downEl = document.getElementById('down')

upEl.addEventListener('click', scoreUp)
downEl.addEventListener('click', scoreDown)

function scoreUp() {
  let score = parseInt(holeScoreEl.value)
  score += 1
  holeScoreEl.value = score
}

function scoreDown() {
  let score = parseInt(holeScoreEl.value)
  if (score > 1) {
    score -= 1
  }
  holeScoreEl.value = score
}