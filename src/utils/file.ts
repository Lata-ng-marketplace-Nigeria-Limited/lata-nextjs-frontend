

export const getFileUrlFromFile = async (file: File): Promise<string> => {
  return await new Promise((resolved) => {
    let fileURL = "";
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = (e) => {
      if (e.target && file) {
        fileURL = e.target.result as string;
      }
      resolved(fileURL);
    };
  });
};

export function isFileSizeGreaterThan(file: File, sizeInMB: number): boolean {
  const fileSizeInBytes = file.size;
  const fileSizeInMB = fileSizeInBytes / (1024 * 1024); // Convert bytes to megabytes

  return fileSizeInMB > sizeInMB;
}

export const convertBytesToMB = (bytes: number): number => {
  return Math.ceil(bytes / (1024 * 1024));
};

export const convertFileArrayToFileList = (
  files: Array<File | undefined> | undefined
): FileList => {
  if (!files) return new DataTransfer().files;
  const fileList = new DataTransfer();
  files.forEach((file) => {
    if (!file) return;
    const fileData = new File([file], file.name, {
      type: file.type,
    });
    fileList.items.add(fileData);
  });
  return fileList.files;
};

export const generateInvoicePdfName = ({
  planName,
  planDuration,
  reference,
}: {
  planName?: string;
  planDuration?: string;
  reference?: string;
}) => {
  return `Lata.ng-Invoice-${planName}-${planDuration}months-${reference}`;
};

export const downloadPdf = ({
  fileName,
  url,
}: {
  url: string;
  fileName: string;
}) => {
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = `${fileName}.pdf`;
  downloadLink.click();
};

// export const getBase24Image = async (imageUrl: string) => {
//   try {
//     const res = await fetch(imageUrl);
//
//     if (!res.ok) {
//       throw new Error(`Failed to fetch image: ${res.status} ${res.statusText}`);
//     }
//
//     const buffer = await res.arrayBuffer();
//
//     const { base64 } = await getPlaiceholder(Buffer.from(buffer));
//
//     //console.log(`base64: ${base64}`)
//
//     return base64;
//   } catch (e) {
//     if (e instanceof Error) console.log(e.stack);
//   }
// };
