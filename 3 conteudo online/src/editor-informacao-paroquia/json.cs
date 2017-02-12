using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using System.IO;

namespace editor_informacao_paroquia
{
    public class json
    {
        [DataContract(Namespace = "", Name = "content")]
        public class Content
        {
            [DataMember(Name = "builtin")]
            public bool builtin { get; set; }

            [DataMember(Name = "title")]
            public string title { get; set; }

            [DataMember(Name = "text")]
            public string html { get; set; }
        }

        [DataContract(Namespace = "", Name = "content-list")]
        public class ContentList
        {
            [DataMember(Name = "list")]
            public List<Content> list { get; set; }
            public ContentList()
            {
                list = new List<Content>();
            }
        }



        public static void writeToFile(string outputfile, ContentList list)
        {
            FileStream fs = new FileStream(outputfile, FileMode.Create);
            DataContractJsonSerializer jsonser = new DataContractJsonSerializer(typeof(ContentList));
            jsonser.WriteObject(fs, list);
            fs.Close();
        }


        public static ContentList readFromFile(string inputfile)
        {
            ContentList result = null;

            if (File.Exists(inputfile))
            {
                FileStream fs = new FileStream(inputfile, FileMode.Open);
                DataContractJsonSerializer jsonser = new DataContractJsonSerializer(typeof(ContentList));
                result = (ContentList)jsonser.ReadObject(fs);
                fs.Close();
            }
            else
            {
                result = new ContentList();
            }

            return result;
        }

        
    }
}
