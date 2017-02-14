using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

using System.Runtime.Serialization;
using System.Runtime.Serialization.Json;
using System.IO;

namespace editor_grupos
{
    public class GroupJSON
    {
        [DataContract(Namespace = "", Name = "group")]
        public class Group
        {
            [DataMember(Name = "name")]
            public string name { get; set; }

            [DataMember(Name = "text")]
            public string text { get; set; }

            [DataMember(Name = "parish")]
            public string parish { get; set; }

        }

        [DataContract(Namespace = "", Name = "group-list")]
        public class GroupList
        {
            [DataMember(Name = "group-list")]
            public List<Group> group_list { get; set; }
            public GroupList()
            {
                group_list = new List<Group>();
            }


            public void Sort()
            {
                group_list.Sort(delegate (Group a, Group b)
                {
                    return a.parish.CompareTo(b.parish)*10000 + a.name.CompareTo(b.name);
                });
            }
        }



        public static void writeToFile(string outputfile, GroupList list)
        {
            FileStream fs = new FileStream(outputfile, FileMode.Create);
            DataContractJsonSerializer jsonser = new DataContractJsonSerializer(typeof(GroupList));
            jsonser.WriteObject(fs, list);
            fs.Close();
        }


        public static GroupList readFromFile(string inputfile)
        {
            GroupList result = null;

            if (File.Exists(inputfile))
            {
                FileStream fs = new FileStream(inputfile, FileMode.Open);
                DataContractJsonSerializer jsonser = new DataContractJsonSerializer(typeof(GroupList));
                result = (GroupList)jsonser.ReadObject(fs);
                fs.Close();
            } else
            {
                result = new GroupList();
            }

            return result;
        }


    }
}
