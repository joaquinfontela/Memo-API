const assert = require('assert');
const { Given, When, Then } = require('@cucumber/cucumber');

const ReportsHandler = require('../../ReportHandler')


Given('User selected an existent project', function () {
    this.reportsHandler = new ReportsHandler()
})

Given('User selected an existent work', function () { })

When('User enters eight or less hours of work', function () {
    assert()
})