
const fetchUrl: string = "http://localhost:8080/usuario"

/* Metodo Get */
export const fetchGet = fetch(fetchUrl,{
    method:"GET",
})
    .then((res)=> res.json())
    .then((data) => console.log(data))


/* Metodo Post */
export const fetchPost = async (data: any) => {
  const response = await fetch(fetchUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Error HTTP: ${response.status}`);
  }

  const result = await response.json();
  console.log(result);
  return result;
};