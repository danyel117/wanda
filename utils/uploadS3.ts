import { ParsedFormData } from 'types';

const uploadFile = async (path: string, file: File, bucket: string) => {
  const filename = `${path}/${encodeURIComponent(file.name)}`;
  const res = await fetch(
    `/api/upload-url?file=${filename}&size=${file.size}&bucket=${bucket}`
  );
  const { data, isMultipart } = await res.json();

  if (!isMultipart) {
    const {
      presignedPost: { url, fields },
      finalURL,
    } = data;
    const formData = new FormData();
    Object.entries({ ...fields, file }).forEach(([key, value]) => {
      const valueAny: any = value;
      formData.append(key, valueAny);
    });
    const s3UploadResponse = await fetch(url, {
      method: 'POST',
      body: formData,
    });
    if (s3UploadResponse) {
      return { finalURL, isMultipart: false };
    }

    return null;
  }

  return { id: data.UploadId, isMultipart: true };
};

const uploadFormFiles = async (
  formData: ParsedFormData,
  path = '',
  mapping: any = {}
) => {
  const formDataCopy = { ...formData };
  await Promise.all(
    Object.keys(formDataCopy).map(async (el) => {
      if (
        Object.prototype.isPrototypeOf.call(File.prototype, formDataCopy[el])
      ) {
        let routeUpload;
        if (path !== '') {
          routeUpload = await uploadFile(
            path,
            formDataCopy[el] as File,
            'wanda-media'
          );
        } else {
          routeUpload = await uploadFile(
            mapping[el].path,
            formDataCopy[el] as File,
            mapping[el].bucket
          );
        }
        if (!routeUpload?.isMultipart) {
          formDataCopy[el] = routeUpload?.finalURL;
        } else {
          formDataCopy[`${el}_multipart`] = {
            file: formDataCopy[el] as File,
            id: routeUpload.id,
          };
        }
      }
    })
  );
  return formDataCopy;
};

export { uploadFormFiles, uploadFile };
