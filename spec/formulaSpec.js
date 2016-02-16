describe("creating teams from players", function () {
    function createPlayer(name, job, salary, secondaryPositions) {
        return {
            name: name,
            position: job,
            salary: salary,
            secondaryPositions: secondaryPositions
        };
    }

    it("doesn't fail when passed empty lists", function () {
        var results = makeTeams([], 50000, []);
        expect(results.length).toBe(0);
    });

    it("creates only one team when only one player matches the single position", function () {
        var salaryCap = 50000;

        var players = [
            createPlayer("player a", "position a", 50, ["position a"]),
            createPlayer("player b", "position b", 10, ["position b"])
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
                "position": "position a",
                "salary": 50,
                "secondaryPositions": ["position a"]
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
            createPlayer("player a", "position a", 50, ["position a"]),
            createPlayer("player b", "position b", 60, ["position b"])
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
            createPlayer("player a", "position a", 50, ["position a"]),
            createPlayer("player b", "position b", 50, ["position b"])
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

    it("removes duplicate players in different positions before returning", function () {
        var players = [
            createPlayer("player a", "position a", 50, ["position a"]),
            createPlayer("player b", "position a", 10, ["position a"])
        ];

        var positions = {
            first: ["position a"],
            second: ["position a"]
        };

        var results = makeTeams(players, 50000, positions);

        var foundA = false;
        results.forEach(function (team) {
            if (team.first.name == "player a" &&
                team.second.name == "player b") {
                foundA = true;
                return;
            }

            if (team.first.name == "player b" &&
                team.second.name == "player a") {
                foundA = true;
                return;
            }

            fail("found invalid team", team);
        });

        if (!foundA) {
            fail("Could not find [playerA, playerB]");
        }

        expect(results.length).toBe(1);
    });

    it("uses player only if position from their positions array is in positions value array", function () {
        var players = [
            createPlayer("player a", "position a", 50, []),
            createPlayer("player b", "position b", 10, [])
        ];

        var positions = {
            first: ["position a", "position d"],
            second: ["position b", "position c"]
        };

        var results = makeTeams(players, 50000, positions);

        expect(results.length).toBe(0);
    });
    it("only creates a single team when usable positions are limited", function () {
        var salaryCap = 50000;

        var smallForward = {
            name: "Bojan Bogdanovic",
            position: "small forward",
            salary: 3900,
            secondaryPositions: [
                "small forward"
            ]
        };
        var utility = {
            name: "Chandler Parsons",
            position: "small forward",
            salary: 5300,
            secondaryPositions: [
                "utility"
            ]
        };
        var guard = {
            name: "Avery Bradley",
            position: "shooting guard",
            salary: 5500,
            secondaryPositions: [
                "guard"
            ]
        };
        var forward = {
            name: "Dirk Nowitzki",
            position: "power forward",
            salary: 6400,
            secondaryPositions: [
                "forward"
            ]
        };
        var center = {
            name: "Brook Lopez",
            position: "center",
            salary: 7500,
            secondaryPositions: [
                "center"
            ]
        };
        var pointGuard = {
            name: "Chris Lopez",
            position: "point guard",
            salary: 9700,
            secondaryPositions: [
                "point guard"
            ]
        };
        var powerForward = {
            name: "Amir Johnson",
            position: "power forward",
            salary: 5300,
            secondaryPositions: [
                "power forward"
            ]
        };
        var shootingGuard = {
            name: "Allen Crabbe",
            position: "shooting guard",
            salary: 4400,
            secondaryPositions: [
                "shooting guard"
            ]
        };

        var players = [
            smallForward,
            utility,
            guard,
            forward,
            center,
            pointGuard,
            powerForward,
            shootingGuard
        ];

        // copied from script.js
        var positions = {
            "point guard": ["point guard"],
            "shooting guard": ["shooting guard"],
            "small forward": ["small forward"],
            "power forward": ["power forward"],
            "center": ["center"],
            "guard": ["point guard", "shooting guard"],
            "forward": ["small forward", "power forward"],
            "utility": ["point guard", "shooting guard", "small forward", "power forward", "center"]
        };

        expect(Object.keys(positions).length).toBe(players.length);

        var sum = 0;
        players.forEach(function (player) {
            sum += player.salary;
        });
        expect(sum).toBeLessThan(50000);

        var results = makeTeams(players, 50000, positions);

        if (results.length == 0) {
            fail("expected a team to be created");
        } else {
            var team = results[0];

            expect(team["point guard"]).toBe(pointGuard);
            expect(team["shooting guard"]).toBe(shootingGuard);
            expect(team["small forward"]).toBe(smallForward);
            expect(team["power forward"]).toBe(powerForward);
            expect(team["center"]).toBe(center);
            expect(team["guard"]).toBe(guard);
            expect(team["forward"]).toBe(forward);
            expect(team["utility"]).toBe(utility);
        }
    });
});
