Feature: Scenarios from user stories

    Scenario: Successful hour report
        Given User selected an existent project
        And User selected an existent work
        When User enters eight or less hours of work
        Then System informs the report was successful

    Scenario: Unsuccessful hour report
        Given User selected an existent project
        And User selected an existent work
        When User enters more than eight hours of work
        Then System informs there was en error in work hours entered

    Scenario: Successful schedule query
        Given User with id 1 reported 4 hours and 32 minutes of work
        When User with id 1 queries his reported hours
        Then System will inform one report with its date, project, work, user name and 4 hours and 32 minutes of work

    Scenario: Unsuccessful schedule query
        Given User did not report its hours
        When User queries reported hours
        Then System will inform there is not hour report information to be shown

    Scenario: Project visualization
        Given I am an user
        When User consults projects
        Then System informs about each of the existent projects

    Scenario: Project selection
        Given There is a list of existent projects
        When User selects a project from the list of existent projects
        Then System will inform all works corresponding to the selected project

    # Scenario: Unsuccessful Date fill in
    #     Given A calendar with dates
    #     When The user tries to select a future date
    #     Then System does not let the user select a future date
    # Scenario: Successful Date fill in
    #     Given A calendar with dates
    #     When The user tries to select a past or present date
    #     Then System selects the date the user selected

    # Calendar date filtering is a frontend task.


    # Scenario: Upload description
    #     Given I am an user
    #     When User is reporting its hours
    #     Then System lets the user add a note describing the work

    # Frontend task


    Scenario: Report editing
        Given User selects an 4 hour and 11 minutes report
        When User edits the amount of reported hours to 6 and 34 minutes on report
        Then System will update the amount of reported hours to 6 and 34 minutes on report

    Scenario: Report deleting
        Given User with id 2 made an 7 hour and 17 minutes report
        When User deletes the report
        Then System will not find the report

    Scenario: Report search filtered by date
        Given I want to make a query
        When I enter a starting date '07/12/2021'
        And I enter an ending date '01/01/2022'
        Then System will show date, project, work, employee name and hours of each report in the date range selected

    Scenario: Report search filtered by project
        Given I am an user
        When User consults reports filtered by project
        Then System informs about each of the existent reports corresponding to the project

    Scenario: Report search filtered by task
        Given I am an user
        When User consults reports filtered by task
        Then System informs about each of the existent reports corresponding to the task