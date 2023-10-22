/*!
* Start Bootstrap - Resume v7.0.6 (https://startbootstrap.com/theme/resume)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-resume/blob/master/LICENSE)
*/
//
// Scripts
//

const updateStatusBadge = (newStatus) => {
    const serverStatus = document.querySelector('.server-status');
    const { online, players } = newStatus;
    const oldClassName = 'bg-danger';
    let className = oldClassName,
        newText = serverStatus.innerText;
    if (online && players.max === 0) {
        newText = 'TEMPORARILY OFFLINE';
        className = 'bg-warning';
    } else if (online) {
        newText = 'ONLINE';
        className = 'bg-success';
    } else {
        newText = 'OFFLINE';
    }
    // serverStatus.innerText = newText !== 'OFFLINE' ? `${version} - ${newText}` : newText;
    serverStatus.innerHTML = newText;
    serverStatus.classList.remove(oldClassName);
    serverStatus.classList.add(className);

    localStorage.setItem('last-wma-status', JSON.stringify({
        timestamp: new Date().getTime(),
        data: newStatus
    }));
}

const errorFallback = (error) => {
    console.error(error);
    const serverStatus = document.querySelector('.server-status');
    serverStatus.innerHTML = 'UNKNOWN';
};

const fetchUpdatedStatus = () => {
    fetch('https://api.mcsrvstat.us/3/play.wma.im')
        .then(resp => resp.json())
        .then(updateStatusBadge)
        .catch(errorFallback);
};

const loadLatestStatus = () => {
    const lastStatus = localStorage.getItem('last-wma-status');
    if (!lastStatus) {
        fetchUpdatedStatus();
    } else {
        let lastStatusObj;
        try {
            lastStatusObj = JSON.parse(lastStatus);
        } catch (err) {
            console.error(err);
            fetchUpdatedStatus();
            return;
        }
        // 5 minutes
        const maxTimeDiff = 300000;
        const currentTime = new Date().getTime();
        if (currentTime - lastStatusObj.timestamp > maxTimeDiff) {
            fetchUpdatedStatus();
        } else {
            try {
                updateStatusBadge(lastStatusObj.data);
            } catch (e) {
                errorFallback(e);
            }
        }
    }
}

window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const sideNav = document.body.querySelector('#sideNav');
    if (sideNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#sideNav',
            rootMargin: '0px 0px -40%',
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

    tippy('[data-tippy-content]', {
        placement: 'bottom'
    });

    loadLatestStatus();
});
