const delButton = document.querySelector('#delete');

//deletes selected photo and then redirects back to profile
const delButtonHandler = async (event) => {
    if (event.target.hasAttribute('data-id')) {
      const id = event.target.getAttribute('data-id');
        console.log(id);
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
      });
      console.log(response);
      document.location.replace('/profile');
    }
  };


  delButton.addEventListener('click', delButtonHandler);