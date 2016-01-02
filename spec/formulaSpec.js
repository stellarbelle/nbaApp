describe("creating teams from players", function () {
    it("doesn't fail when passed empty lists", function () {
        var results = makeTeams([], 50000, []);
        expect(results.length).toBe(0);
    });

    it("creates only one team when only one player matches the single position", function () {
        var salaryCap = 50000;

        var players = [
            {
                "name": "player a",
                "job": "position a",
                "salary": 50
            }, {
                "name": "player b",
                "job": "position b",
                "salary": 10
            }
        ];

        var positions = {
            "first": ["position a"]
        };
        var teams = makeTeams(players, salaryCap, positions);

        expect(teams.length).toBe(1);

        var team = teams[0];
        expect(team["first"]).toBe(players[0]);
        expect(team.totalSalary).toBe(50);
    });

    it("creates zero team when one player passed over cap", function () {
        var salaryCap = 40;

        var players = [
            {
                "name": "player a",
                "job": "position a",
                "salary": 50
            }
        ];

        var positions = {
            "first": ["position a"]
        };
        var results = makeTeams(players, salaryCap, positions);

        expect(results.length).toBe(0);
    });

    it("creates one team with multiple positions filled", function () {
        var salaryCap = 50000;

        var players = [
            {
                "name": "player a",
                "job": "position a",
                "salary": 50
            }, {
                "name": "player b",
                "job": "position b",
                "salary": 60
            }
        ];

        var positions = {
            "first": ["position a"],
            "second": ["position b"]
        };
        var results = makeTeams(players, salaryCap, positions);

        expect(results.length).toBe(1);

        expect(results[0]["first"]).toBe(players[0]);
        expect(results[0]["second"]).toBe(players[1]);
        expect(results[0].totalSalary).toBe(110);
    });

    it("handles multiple jobs per position", function () {
        var salaryCap = 50000;

        var players = [
            {
                "name": "player a",
                "job": "position a",
                "salary": 50
            }, {
                "name": "player b",
                "job": "position b",
                "salary": 50
            }
        ];

        var positions = {
            "first": ["position a", "position b"]
        };

        var results = makeTeams(players, salaryCap, positions);

        var foundA = false, foundB = false;
        results.forEach(function (result) {
            if (result.first.name == "player a") {
                foundA = true;
                return;
            }

            if (result.first.name == "player b") {
                foundB = true;
                return;
            }

            fail("found invalid team", result);
        });

        if (!foundA) {
            fail("could not find team with [playerA]");
        }

        if (!foundB) {
            fail("could not find team with [playerB]")
        }
    });
});
