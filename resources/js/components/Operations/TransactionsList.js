import React from "react";

import _ from "lodash";

import { ListGroup } from "react-bootstrap";

import { connect } from "react-redux";

import { If, Else, Then } from "react-if";

import TransactionsListByDate from "./TransactionsListByDate";

function TransactionsList(props) {
    const { transactions, dateRange, categories, moneyRange, search } = props;

    const filteredTransaction = transactions.filter(transaction => {
        const spent_at = new Date(transaction.spent_at);

        let money;
        if (!transaction.moneySign) {
            money = -1 * transaction.moneyAmount;
        } else {
            money = transaction.moneyAmount;
        }
        return (
            dateRange[1].getTime() - spent_at.getTime() >= 0 &&
            dateRange[0].getTime() - spent_at.getTime() <= 0 &&
            categories.includes(transaction.category) &&
            money >= moneyRange[0] &&
            money <= moneyRange[1] &&
            transaction.description.includes(search)
        );
    });

    const transactionsGroupsByDateObject = _.groupBy(
        filteredTransaction,
        "spent_at"
    );

    let transactionsGroupsByDateArray = [];
    for (let transactionDate in transactionsGroupsByDateObject) {
        transactionsGroupsByDateArray.unshift(
            <TransactionsListByDate
                transactions={transactionsGroupsByDateObject[transactionDate]}
                key={transactionDate}
            />
        );
    }
    return (
        <If condition={filteredTransaction.length === 0}>
            <Then>
                <ListGroup className="bg-white mt-5 text-center p-4">
                    <h4 className="mb-0 font-weight-bold">
                        No transactions found
                    </h4>
                </ListGroup>
            </Then>
            <Else>
                <ListGroup className="bg-white mt-5">
                    {transactionsGroupsByDateArray}
                </ListGroup>
            </Else>
        </If>
    );
}

const mapStateToProps = state => ({
    transactions: state.transactions.transactions,
    dateRange: state.transactions.transactionsFilters.dateRange,
    categories: state.transactions.transactionsFilters.categories,
    moneyRange: state.transactions.transactionsFilters.moneyRange,
    search: state.transactions.transactionsFilters.search
});

export default connect(mapStateToProps)(TransactionsList);
