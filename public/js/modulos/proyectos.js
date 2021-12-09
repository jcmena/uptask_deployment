import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if(btnEliminar) {
    btnEliminar.addEventListener('click', (e) => {
        const urlProyecto = e.target.dataset.proyectoUrl;
        // console.log(urlProyecto);

        Swal.fire({
            title: '¿Deseas borrar este proyecto?',
            text: "Esta acción no se puede revertir!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Borrarlo!',
            cancelButtonText: 'Cancelar!'
        }).then((result) => {
            if (result.value) {
            // Peticion a axios
            const url = `${location.origin}/proyectos/${urlProyecto}`;
            axios.delete(url, {params: {urlProyecto}})
                .then(function(respuesta){
                    //console.log(respuesta);
                    Swal.fire(
                        'Borrado!',
                        respuesta.data,
                        'success'   
                    );

                    setTimeout(() => {
                        window.location.href = '/'
                    }, 3000);
                })
                .catch(() => {
                    Swal.fire(
                        'Hubo un error',
                        'No se pudo eliminar el Proyectos',
                        'error'
                    )
                })        
            }
        })
    })
}
export default btnEliminar;
