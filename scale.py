import math
import random

# only farm + woodchop pop size:
gt = [12, 23, 24, 44, 88, 176, 640, 1408, 5120, 16848, 61440, 202176] #ground truth
print(gt)

e = 2.718281828

# solution looks like a*e^bx
def sol(a, b):
    return [a*e**(b*n) for n in range(1, 13)]



def fitness(a, b):
    diffs = [max(b/a, a/b) for a, b in zip(sol(a, b), gt)]
    return sum(diffs)

def generate_individual():
    a = 0.75 + (random.random()/2)
    b = random.random()/100
    return (fitness(a, b), [a, b])

def random_child(pop):
    n1, n2 = random.choice(pop), random.choice(pop)
    f1, s1 = n1
    f2, s2 = n2
    return (fitness(s1[0], s2[1]), [s1[0], s2[1]])

def mutate(individual):
    delta_a, delta_b = random.random()/10, random.random()/500
    a, b = individual[1][0], individual[1][1]
    mutant = (fitness(a+delta_a, b+delta_b), [a+delta_a, b+delta_b])
    if mutant[0] < individual[0]:
        return mutant
    return individual

POP_SIZE = 256
GENERATIONS = 000
MUTATION_STEPS = 10
pop = [generate_individual() for i in range(POP_SIZE)]
pop = sorted(pop)
for g in range(GENERATIONS):
    # cull population
    pop = pop[:len(pop)//2]
    children = [random_child(pop) for i in range(len(pop))]
    pop = pop + children
    for m in range(MUTATION_STEPS):
        pop = [mutate(individual) for individual in pop]
    pop = sorted(pop)
    print(pop[0])

print([math.floor(n) for n in sol(26.12364549927238, 0.5864500871456788)])

# fitness, solution = try_solution(a, b)