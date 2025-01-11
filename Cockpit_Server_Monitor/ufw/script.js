document.addEventListener('DOMContentLoaded', () => {
    const statusLabel = document.getElementById('statusLabel');
    const checkStatusButton = document.getElementById('checkStatusButton');

    checkStatusButton.addEventListener('click', () => {
        cockpit.spawn(["sudo", "ufw", "status"], { superuser: "try" })
            .then(data => {
                statusLabel.textContent = `Status: ${data.trim()}`;
            })
            .catch(err => {
                statusLabel.textContent = `Error: ${err}`;
            });
    });
});
