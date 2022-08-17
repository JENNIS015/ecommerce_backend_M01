///PRODUCTOS
async function detail(value) {
  await fetch(`/api/productos/${value}`, { method: 'GET' })
    .then(function (response) {
      if (response.ok) {
        window.location.href = `/productos/${value}`;
      }
    })
    .catch(function (error) {
      // console.log(error);
    });
}

async function deleting(value) {
  await fetch(`/api/productos/${value}`, { method: 'DELETE' })
    .then(function () {
      window.location.href = `/productos`;
    })
    .catch(function () {
      //   window.location.href = `/error/`;
    });
}

async function edit(value) {
  await fetch(`/api/productos/edit/${value}`, {
    method: 'GET',
  })
    .then(function (response) {
      if (response.ok) {
        window.location.href = `/productos/edit/${value}`;
      }
    })
    .catch(function (error) {
      //  console.log(error);
    });
}

async function actualizar(value) {
  let nombre = document.getElementById('nombre').value;
  let descripcion = document.getElementById('descripcion').value;
  let foto = document.getElementById('foto').value;
  let categoria = document.getElementById('categoria').value;
  let precio = document.getElementById('precio').value;
  let stock = document.getElementById('stock').value;
  let color = document.getElementById('color').value;
  await fetch(`/api/productos/${value}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      nombre,
      descripcion,
      foto,
      categoria,
      precio,
      stock,
      color
    }),
  })
    .then((response) => {
      if (response) {
        window.location.href = '/productos';
      }
    })

    .catch((error) => {
      //   console.log(error);
    });
}

/* ---------------------- Cart ----------------------*/
async function agregar(idProducto) {
  const idCart = localStorage.getItem('my_token');

  if (!idCart) {
    await fetch('/api/carrito/', {
      method: 'POST',
    })
      .then(function (response) {
        return response.json();
      })
      .then((data) => {
        const id = data.cart._id;
        localStorage.setItem('my_token', id);
        fetch(`/api/carrito/${id}/productos/${idProducto}`, {
          method: 'POST',
        });
      })
      .catch((err) => {
        console.error('Request failed', err);
      });
  } else {
    fetch(`/api/carrito/${idCart}/productos/${idProducto}`, {
      method: 'POST',
    });
  }
}




function cart() {
  let idCart;
  localStorage.getItem('my_token')
    ? (idCart = window.localStorage.getItem('my_token'))
    : (idCart = '');
  window.location.href = `/carrito/${idCart}`;
}

async function actualizarCarrito() {
  const idCart = localStorage.getItem('my_token');
  const address = document.getElementById('address').value;
  const email = document.getElementById('email').value;

  await fetch(`/api/carrito/${idCart}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      address,
      email,
    }),
  })
    .then(function (response) {
      if (response) {
        window.location.href = `/pedido/${idCart}`;
      }
    })
    .catch(function (error) {
      //  console.log(error);
    });
}

async function deleteItemCart(idProducto) {
  const idCart = window.localStorage.getItem('my_token');
  await fetch(`/api/carrito/${idCart}/productos/${idProducto}`, {
    method: 'DELETE',
  })
    .then(function (response) {
      if (response) {
        window.location.href = `/carrito/${idCart}`;
      }
    })
    .catch(function (error) {
      //   console.log(error);
    });
}

async function borrarCarrito() {
  const idCart = window.localStorage.getItem('my_token');
  await fetch(`/api/carrito/${idCart}`, {
    method: 'DELETE',
  })
    .then(function (response) {
      if (response) {
        window.location.href = `/carrito/${idCart}`;
      }
    })
    .catch(function (error) {
      //   console.log(error);
    });
}

/* ---------------------- Register ----------------------*/
var fileTag = document.getElementById('avatar'),
  preview = document.getElementById('preview');
fileTag
  ? fileTag.addEventListener('change', function () {
      changeImage(this);
    })
  : '';

function changeImage(input) {
  var reader;

  if (input.files && input.files[0]) {
    reader = new FileReader();

    reader.onload = function (e) {
      preview.setAttribute('src', e.target.result);
    };

    reader.readAsDataURL(input.files[0]);
  }
}

/* ---------------------- Order ----------------------*/
function checkOrder() {
  let email = document.getElementById('email').value;
  let name = document.getElementById('name').value;
  let lastName = document.getElementById('lastName').value;
  let address = document.getElementById('address').value;
  let phone = document.getElementById('phone').value;

  if (
    (email != '') |
    (name != '') |
    (lastName != '') |
    (address != '') |
    (phone != '')
  ) {
    document.getElementById('submit').disabled = false;
    document.getElementById('message').innerHTML = ' ';
  } else {
    document.getElementById('submit').disabled = true;
    document.getElementById('message').innerHTML = 'Campos incompletos';
  }
}

async function actualizarOrder() {
  let email = document.getElementById('email').value;
  let name = document.getElementById('name').value;
  let lastName = document.getElementById('lastName').value;
  let address = document.getElementById('address').value;
  let phone = document.getElementById('phone').value;

  const idCart = window.localStorage.getItem('my_token');
  await fetch(`/api/pedido/${idCart}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      name,
      lastName,
      address,
      phone,
    }),
  })
    .then(function (response) {
      if (response) {
        fetch(`/api/carrito/${idCart}`, {
          method: 'DELETE',
        });
        window.location.href = `/api/pedido/gracias`;
      }
    })

    .catch((error) => {
      //  console.log(error);
    })

    .finally(() => {
      window.location.href = `/api/pedido/gracias`;
      localStorage.removeItem('my_token');
    });
}

//login
function check_pass() {
  if (
    document.getElementById('password').value ==
    document.getElementById('confirm_password').value
  ) {
    document.getElementById('submit').disabled = false;
    document.getElementById('message').innerHTML = ' ';
  } else {
    document.getElementById('submit').disabled = true;
    document.getElementById('message').innerHTML =
      'Las contraseñas no coinciden';
  }
}

async function actualizarProfile(value) {
  const name = document.getElementById('first_name').value;
  const lastName = document.getElementById('last_name').value;
  const age = document.getElementById('age').value;
  const phone = document.getElementById('phone').value;
  const address = document.getElementById('location').value;

  await fetch(`/profile/${value}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name,
      lastName,
      age,
      phone,
      address,
    }),
  })
    .then((response) => {
      if (response) {
        window.location.href = '/profile';
      }
    })

    .catch((error) => {});
}
