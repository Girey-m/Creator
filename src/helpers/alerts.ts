import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const showLoadingAlert = () => {
  MySwal.fire({
    title: "<p>Loading...</p>",
    didOpen: () => {
      MySwal.showLoading();
    },
    theme: "dark"
  });
};

export const showSuccessAlert = () => {
  MySwal.fire({
    title: "<p>Задачи успешно загружены</p>",
        theme: "dark"
  });
};

export const showErrorAlert = (message: string) => {
  MySwal.fire({
    title: message,
        theme: "dark"
  });
};