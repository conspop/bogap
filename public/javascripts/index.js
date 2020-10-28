let commitmentEls = document.querySelectorAll('#commitment')
commitmentEls.forEach(element => element.addEventListener('click', handleClick))

async function handleClick(e) {
  
  //toggle committed button and update database
  let userId = e.target.dataset.user
  let eventId = e.target.dataset.event
  if (e.target.classList.contains('registration-not-committed')) {
    await fetch(`/users/${userId}/events/${eventId}/ajax`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        userId: userId,
        eventId: eventId
      })
    }).then(res => res.json())
    e.target.classList.remove('registration-not-committed')
    e.target.classList.add('registration-committed')
    e.target.innerHTML = 'Committed <svg width="1.2em" height="1.2em" viewBox="0 0 16 16" class="bi bi-calendar2-check" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM2 2a1 1 0 0 0-1 1v11a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1H2z"/><path d="M2.5 4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5V4z"/><path fill-rule="evenodd" d="M10.854 8.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708 0z"/></svg>'
  } else if (e.target.classList.contains('registration-committed')) {
    await fetch(`/users/${userId}/events/${eventId}/ajax`, {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        userId: userId,
        eventId: eventId
      })
    }).then(res => res.json())
    e.target.classList.remove('registration-committed')
    e.target.classList.add('registration-not-committed')
    e.target.innerHTML = 'Not committed<svg width="1.2em" height="1.2em" viewBox="0 0 16 16" class="bi bi-calendar-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5zM1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4H1z"/><path fill-rule="evenodd" d="M6.146 7.146a.5.5 0 0 1 .708 0L8 8.293l1.146-1.147a.5.5 0 1 1 .708.708L8.707 9l1.147 1.146a.5.5 0 0 1-.708.708L8 9.707l-1.146 1.147a.5.5 0 0 1-.708-.708L7.293 9 6.146 7.854a.5.5 0 0 1 0-.708z"/></svg>'
  }

  //show committed players
  
}

