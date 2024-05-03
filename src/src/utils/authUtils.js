const buildResourceExpression = resourceType => `org:tml:resource:${resourceType}`;

const elements = target => target.split(':');

const isWildcard = element => element === '*';

const elementMatch = (element1, element2) => 
  element1 === element2 || isWildcard(element1) || isWildcard(element2);

const commonElementsMatch = (expression1Elements, expression2Elements) => 
  [
    ...Array(
      Math.min(expression1Elements.length, expression2Elements.length),
    ).keys(),
  ].every(index =>
    elementMatch(expression1Elements[index], expression2Elements[index]),
  );

const uncommonElementsMatch = (expression1Elements, expression2Elements) => {
  const expression1Size = expression1Elements.length;
  const expression2Size = expression2Elements.length;
  const indexOfLastComparableElement =
    Math.min(expression1Size, expression2Size) - 1;
  return (
    expression1Size === expression2Size ||
    (expression1Size > expression2Size &&
      isWildcard(expression2Elements[indexOfLastComparableElement])) ||
    (expression2Size > expression1Size &&
      isWildcard(expression1Elements[indexOfLastComparableElement]))
  );
};

const matchBasedOnWildcard = (expression1, expression2) => {
  const expression1Elements = elements(expression1);
  const expression2Elements = elements(expression2);
  return (
    commonElementsMatch(expression1Elements, expression2Elements) &&
    uncommonElementsMatch(expression1Elements, expression2Elements)
  );
};

export const resourceExpressionsMatch = (expression1, expression2) => (
  expression1 === expression2 ||
  matchBasedOnWildcard(expression1, expression2)
);

export const getAllowedOperations = (
  resourceTypes,
  authPolicies,
) => {
  const evaluatedOperationsForAllResourceTypes = [];
  resourceTypes.forEach(resourceType => {
    const resourceExpression = buildResourceExpression(resourceType);
    const evaluatedOperations = authPolicies.reduce((acc, policy) => {
      const matches = policy.allowed.some(expression =>
        resourceExpressionsMatch(expression, resourceExpression),
      );
      if (matches) acc.push(policy.operation);
      return acc;
    }, []);
    evaluatedOperationsForAllResourceTypes.push(...evaluatedOperations);
  });
  return evaluatedOperationsForAllResourceTypes;
};