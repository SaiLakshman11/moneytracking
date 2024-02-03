document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('transactionForm');
    const transactionList = document.getElementById('transactionList');
    const balance = document.getElementById('balance');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const description = document.getElementById('description').value;
        const amount = document.getElementById('amount').value;
        const type = document.getElementById('transactionType').value;

        await fetch('/api/transactions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ description, amount, type }),
        });

        form.reset();
        fetchTransactions();
    });

    const fetchTransactions = async () => {
        const response = await fetch('/api/transactions');
        const transactions = await response.json();

        updateUI(transactions);
    };

    const updateUI = (transactions) => {
        let totalBalance = 0;
        transactionList.innerHTML = '';
    
        transactions.forEach((transaction) => {
            const listItem = document.createElement('li');
            const amountSign = transaction.type === 'income' ? '+' : '-';
            listItem.innerHTML = `
                <span>${transaction.description}</span>
                <span class="${transaction.type === 'income' ? 'income' : 'expense'}">${amountSign}$${Math.abs(transaction.amount).toFixed(2)}</span>
            `;
            transactionList.appendChild(listItem);
    
            totalBalance += transaction.type === 'income' ? transaction.amount : -transaction.amount;
        });
    
        balance.textContent = `Balance: $${totalBalance.toFixed(2)}`;
    };

    fetchTransactions();
});
