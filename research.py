import os

research = [{
    "Farming": 0,
    "Mining ": 0,
    "Logging": 0,
    "Bear Repellent": None,
    "  Irrigation  ": None,
    "Reinforcements": None,
}, {
    " Oracle ": None,
    " Chapel ": None,
    "Lightning Rods": None,
    "  N95 Masks   ": None,
    " Fire Brigade ": None,
}, {
    "Mana Sauna": None,
    "Job Market": None,
    " War Strats ": None,
    "Combat Magic": None,
}, {
    "Real Estate Agency": None,
    " Spiked Walls ": None,
    "Sell Buildings": None,
}]

def TurnToMonth(n):
    seasons = ["Spring", "Summer", "Fall", "Winter"]
    return f"{seasons[n//3]} {n%3 + 1}"

def Print():
    for i in range(research[0]["Logging"]+1):
        print(f"Tier {i+1}:")
        for k, v in research[i].items():
            if v is None:
                print(f"  Unlock {k}")
            elif v is True:
                print(f"  {k}: unlocked")
            else:
                print(f"  {k}: [{'x' if v >= 1 else ' '}] [{'x' if v >= 2 else ' '}] [{'x' if v >= 3 else ' '}]")

def EndTurn(n):
    global research
    if n == 0:
        research[0]["School "] = 0
    elif n == 1:
        research[1]["Barracks"] = 0
    elif n == 4:
        research[2]["Walls"] = 0
    elif n == 4:
        research[3]["Artillery"] = 0

if __name__ == "__main__":
    turn = 0
    while True:
        try:
            os.system('clear')
            print(TurnToMonth(turn))
            Print()
            inp = input("> ")
            cmd, arg = inp.split('.')
            print(cmd, arg)
            if cmd == 'r':
                if arg == 'farm':
                    research[0]["Farming"] += 1
                elif arg == 'mine':
                    research[0]["Mining "] += 1
                elif arg == 'log':
                    research[0]["Logging"] += 1
                elif arg == 'school':
                    research[0]["School "] += 1
                elif arg == 'oracle':
                    if research[1][" Oracle "] is None:
                        research[1][" Oracle "] = 0
                    research[1][" Oracle "] += 1
                elif arg == 'chapel':
                    if research[1][" Chapel "] is None:
                        research[1][" Chapel "] = 0
                    research[1][" Chapel "] += 1
                elif arg == 'barracks':
                    research[1]["Barracks"] += 1
                elif arg == 'sauna':
                    if research[2]["Mana Sauna"] is None:
                        research[2]["Mana Sauna"] = 0
                    research[2]["Mana Sauna"] += 1
                elif arg == 'jobs':
                    if research[2]["Job Market"] is None:
                        research[2]["Job Market"] = 0
                    research[2]["Job Market"] += 1
                elif arg == 'firm':
                    if research[3]["Real Estate Agency"] is None:
                        research[3]["Real Estate Agency"] = 0
                    research[3]["Real Estate Agency"] += 1
                elif arg == 'bear':
                    research[0]["Bear Repellent"] = True
                elif arg == 'irrigation':
                    research[0]["  Irrigation  "] = True
                elif arg == 'reinforce':
                    research[0]["Reinforcements"] = True
                elif arg == 'rods':
                    research[1]["Lightning Rods"] = True
                elif arg == 'masks':
                    research[1]["  N95 Masks   "] = True
                elif arg == 'fireman':
                    research[1][" Fire Brigade "] = True
                elif arg == 'strats':
                    research[2][" War Strats "] = True
                elif arg == 'combat':
                    research[2]["Combat Magic"] = True
                elif arg == 'spikes':
                    research[3]["Spiked Walls"] = True
                elif arg == 'sell':
                    research[3]["Sell Buildings"] = True
                pass
            elif cmd == 'n':
                EndTurn(turn)
                turn += 1
        except EOFError:
            break
        except KeyboardInterrupt:
            break
        except:
            pass
