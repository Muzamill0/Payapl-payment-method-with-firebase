import url from './config.js';

async function fetchAdminData() {
    const token = sessionStorage.getItem('authorization');

    if (token) {
        const response = await fetch(url + '/admin', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const result = await response.json();

        if (result.status === 'fail') {
            window.location.href = '../login.html';
        } else {
            const admin = result.data;
            document.getElementById('userName').innerText = admin.name;
        }
    } else {
        window.location.href = './login.html';
    }
}

async function fetchPayments() {
    const token = sessionStorage.getItem('authorization');
    const response = await fetch(url + '/admin/get-payments', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
    });

    const payments = await response.json();
    renderPaymentsTable(payments.data);
}

function renderPaymentsTable(payments) {
    const container = document.getElementById('paymentsTableContainer');

    if (!payments || payments.length === 0) {
        container.innerHTML = "<p>No payments available.</p>";
        return;
    }

    const table = document.getElementById('paymentsTable');

    table.innerHTML = '';

    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>User Token</th>
            <th>Order ID</th>
            <th>User Email</th>
            <th>Payment Date</th>
            <th>Amount</th>
            <th>Currency</th>
            <th>Status</th>
        </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    payments.forEach(payment => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${payment.user_token}</td>
            <td>${payment.paypal_transaction_id}</td>
            <td>${payment.payer_email}</td>
            <td>${new Date(payment.payment_date).toLocaleString()}</td>
            <td>${payment.amount}</td>
            <td>${payment.currency}</td>
            <td>${payment.status}</td>
        `;

        tbody.appendChild(row);
    });

    table.appendChild(tbody);

    $(document).ready(function () {
        $('#paymentsTable').DataTable({
            paging: true,
            searching: true,
            ordering: true,
            info: true,
            pageLength: 10
        });
    });
}



document.addEventListener('DOMContentLoaded', (event) => {
    fetchAdminData();
    fetchPayments();

    const logoutButton = document.getElementById('logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            sessionStorage.removeItem('authorization');
            window.location.href = './login.html';
        });
    }
});
