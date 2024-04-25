import PropTypes from 'prop-types';
import { useAllowedOperationsContext } from '../../hocs/withAllowedOperationsProvider/withAllowedOperationsProvider';

const AuthChecker = ({ operation, children }) => {
  const { allowedOperations } = useAllowedOperationsContext();
  const isAuthorized = allowedOperations.includes(operation);
  return children(isAuthorized);
};

AuthChecker.propTypes = {
  children: PropTypes.func.isRequired,
  operation: PropTypes.string,
};

export default AuthChecker;
