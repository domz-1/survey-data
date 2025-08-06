import { Data } from "./json_data";
import "./index.css"


function ResponseGrid() {
  const names = [
    "gender", "region", "age", "city", "q1_rating", "q1_reason",
    "q2_rating", "q2_reason", "q2_reason-Comment", "q3_rating",
    "q3_reason", "q4_1_rating", "q5_1_rating", "rating_outside_توفر المنتجات البترولية",
    "rating_outside_المسافات بين المحطات", "rating_outside_النظافة العامة لمرافق المحطة",
    "rating_outside_نظافة وصيانة المسجد", "rating_outside_نظافة دورات المياه",
    "rating_outside_مظهر العاملين", "rating_outside_تنوع العلامات التجارية (مطاعم ومقاهي)",
    "rating_outside_مستوى التموينات", "rating_outside_خدمات السيارات (مغسلة - تغيير زيوت...)",
    "rating_inside_توفر المنتجات البترولية", "rating_inside_المسافات بين المحطات",
    "rating_inside_النظافة العامة لمرافق المحطة", "rating_inside_توفر المصليات",
    "rating_inside_توفر دورات المياه", "rating_inside_مظهر العاملين",
    "rating_inside_التموينات", "rating_inside_خدمة تعبئة الماء والهواء المجانية",
    "question1", "HappendAt", "InstanceId"
  ];

  const header = [];
  header.push(<th><span>Id</span></th>);
  names.forEach((name) => {
    if (name.includes('rating')) {
      header.push(
        <th key={name}>
          <span>{name}</span>
        </th>
      );
    } else {
      header.push(
        <th key={name}>
          <span>{name}</span>
        </th>
      );
    }
  });

  const trs = [];
  const data = Data;
  let id = 1;

  data.forEach((item) => {
    const cells = [];
    cells.push(<td><span>{id}</span></td>);
    id++;
    
    names.forEach((name) => {
      if (!item[name]) {
        cells.push(<td><span></span></td>);
      } else if (name.includes('rating') && typeof item[name] === 'number') {
        const rating = item[name];
        cells.push(
          <td key={name}>
            <div className="rating-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <span 
                  key={star} 
                  className={star <= rating ? 'star-filled' : 'star-empty'}
                >
                  ★
                </span>
              ))}
            </div>
          </td>
        );
      } else if (Array.isArray(item[name])) {
        cells.push(
          <td>
            <div>
              <ol>
                {item[name].map((value, index) => (
                  <li key={index}><span>{value}</span></li>
                ))}
              </ol>
            </div>
          </td>
        );
      } else if (name === "HappendAt" && typeof item[name] === "string" && item[name].includes("/Date(")) {
        // Convert /Date(timestamp)/ format to normal date and time
        const timestamp = parseInt(item[name].replace("/Date(", "").replace(")/", ""));
        const date = new Date(timestamp);
        const formattedDate = date.toLocaleString();
        cells.push(<td><span>{formattedDate}</span></td>);
      } else {
        cells.push(<td><span>{item[name]}</span></td>);
      }
    });
    
    trs.push(<tr>{cells}</tr>);
  });

  return (
    <table className="table contained alternating-rows">
      <thead>
        <tr>{header}</tr>
      </thead>
      <tbody>{trs}</tbody>
    </table>
  );
}

export default ResponseGrid;
