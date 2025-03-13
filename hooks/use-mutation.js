import { toaster } from "@lib";
import { useRouter } from "next/router";
import { useQueryClient, useMutation as useQueryMutation } from "react-query";

/**
 * Custom hook for useMutation
 *
 * @param {Function} fn - The mutation function.
 * @param {Object} options - Options for mutation behavior.
 * @param {Function} options.successCallback - Callback on success.
 * @param {Function} options.errorCallback - Callback on error.
 * @param {String} options.redirectOnSuccess - URL to redirect on success.
 * @param {String|Array} options.invalidateQueries - A single query key or an array of query keys to invalidate.
 * @returns {Object} Returns the mutation function, status and others.
 * @see https://react-query.tanstack.com/reference/useMutation
 */
const useMutation = (fn, options = {}) => {
  const {
    successCallback,
    errorCallback,
    redirectOnSuccess,
    invalidateQueries,
    ...rest // pass your own options
  } = options;

  const router = useRouter();
  const queryClient = useQueryClient();

  const mutation = useQueryMutation(fn, {
    onSuccess: (data) => {
      if (invalidateQueries) {
        if (Array.isArray(invalidateQueries)) {
          invalidateQueries.forEach((queryKey) => queryClient.invalidateQueries(queryKey));
        } else {
          queryClient.invalidateQueries(invalidateQueries);
        }
      }
      if (data?.message) {
        toaster.success(data?.message);
      }
      if (redirectOnSuccess) {
        router.push(redirectOnSuccess);
      }
      if (typeof successCallback === "function") {
        successCallback();
      }
    },
    onError: (err) => {
      if (err?.message) {
        toaster.error(err?.message);
      }
      if (typeof errorCallback === "function") {
        errorCallback();
      }
    },
    ...rest,
  });

  return mutation;
};

export default useMutation;
