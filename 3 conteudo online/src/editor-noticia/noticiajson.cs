using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using System.IO;

namespace editor_noticia
{
    public class noticiajson
    {
        [DataContract(Namespace = "", Name = "news")]
        public class News
        {
            [DataMember(Name = "page-title")]
            public string page_title { get; set; }

            [DataMember(Name = "news-title")]
            public string news_title { get; set; }

            [DataMember(Name = "news-description")]
            public string news_description { get; set; }

            [DataMember(Name = "news-text")]
            public string news_text { get; set; }

        }

        [DataContract(Namespace = "", Name = "news-list")]
        public class NewsList
        {
            [DataMember(Name = "news-list")]
            public List<News> news_list { get; set; }
            public NewsList()
            {
                news_list = new List<News>();
            }
        }



        public static void writeToFile(string outputfile, NewsList list)
        {
            FileStream fs = new FileStream(outputfile, FileMode.Create);
            DataContractJsonSerializer jsonser = new DataContractJsonSerializer(typeof(NewsList));
            jsonser.WriteObject(fs, list);
            fs.Close();
        }


        public static NewsList readFromFile(string inputfile)
        {
            NewsList result = null;

            if (File.Exists(inputfile))
            {
                FileStream fs = new FileStream(inputfile, FileMode.Open);
                DataContractJsonSerializer jsonser = new DataContractJsonSerializer(typeof(NewsList));
                result = (NewsList)jsonser.ReadObject(fs);
                fs.Close();
            } else
            {
                result = new NewsList();
            }

            return result;
        }


    }
}
